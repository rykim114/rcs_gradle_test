package apps.framework.utils.rfc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoField;
import com.sap.conn.jco.JCoFieldIterator;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoRecordMetaData;
import com.sap.conn.jco.JCoTable;

public class SapManagerJ7 {
	private static final Log	logger = LogFactory.getLog(SapManagerJ7.class);
	
	final static String CONN_FILE_NAME = "SAP"; 
	

	// newSapManagerBinder 통해 부르세요.
	SapManagerJ7() {
	}
	
	/** 연결을 시도합니다. 
	 * @throws JCoException */
	public SapRfcFunction getRfcFunction(String rfcFunctionName) throws JCoException {
		return new SapRfcFunction(CONN_FILE_NAME, rfcFunctionName);
	}
	
	/**
	 * 함수를 선언합니다.
	 * @author		박용서
	 * @since		2018. 2. 20.
	 */
	public static class SapRfcFunction {
		
		final JCoFunction function;
		final JCoDestination destination;
		final String functionName;
		JCoParameterList tables;
		JCoParameterList imports;
		JCoParameterList exports;
		
		JCoTable JCoTables;
		
		long startTime = 0L;
		
		// 생성
		private SapRfcFunction(String connectionFileName, String rfcFunctionName) throws JCoException {
			this.functionName = rfcFunctionName;
			destination = JCoDestinationManager.getDestination(connectionFileName);
			function = destination.getRepository().getFunction(rfcFunctionName);
		}
		
		/**
		 * import 값을 입력합니다.<br>
		 * execute() 이전에 불려야 합니다.
		 * @return JCoParameterList
		 */
		public JCoParameterList imports() {
			if (imports == null) {
				imports = function.getImportParameterList();
			}
			return imports;
		}
		
		/**
		 * export 값을 출력합니다.<br>
		 * execute() 이후 불려야합니다.
		 * @return JCoParameterList
		 */
		public JCoParameterList exports() {
			if (exports == null) {
				exports = function.getExportParameterList();
			}
			return exports;
		}
		
		/**
		 * 실행
		 * @throws JCoException
		 */
		public String execute() throws JCoException {
			// 로그 부분은 임시로 이렇게 해둠.. 적당히 log4j나 logback등으로 찍도로 만들어쓰세요.
		
			startTime = System.currentTimeMillis();
			final StringBuilder logs = new StringBuilder(1024).append("SAP RFC FUNCTION : ").append(functionName);
			// IMPORT
			logs.append("\n# IMPORT\n - ");
			JCoParameterList importList = imports();
			if (importList != null){
				logger.debug("importList");
				for (JCoField e : importList) {
					logger.debug(e.getName()+":"+e.getValue().toString());
				}
			}
			
			// 실행
			function.execute(destination);
			
			// EXPORT
			logs.append("\n\n# EXPORT\n - ");			
			JCoParameterList exportList = exports();
			if (exportList != null){
				logger.debug("exportList");
				for (JCoField e : exportList) {
					
					logger.debug(e.getName()+":"+e.getValue().toString());
				}
			}
			//logs.append("\n\n");
			
			// 테이블 목록
			//logs.append("\n\n# nTABLE [").append(getTableCount()).append("]");
			
			logger.debug("TABLE ["+getTableCount()+"]");
//			tables.forEach(table -> logs.append("\n - ").append(table.getName()).append(" : ").append(table.getTable().getNumRows()));
			for (JCoField table : tables) {
				//logs.append("\n - ").append(table.getName()).append(" : ").append(table.getTable().getNumRows());
				logger.debug("Name : "+table.getName()+"[ "+table.getTable().getNumRows()+" ]");
				
				JCoTable temptable = table.getTable();
				

				JCoRecordMetaData recordMetaData = temptable.getRecordMetaData();
				/*for (int i=0; i< recordMetaData.getFieldCount(); i++) {
					logger.debug("Col : "+recordMetaData.getName(i)+"[ "+recordMetaData.getByteLength(i) +" ]");									
				}*/
				
				if(temptable.getNumRows() > 0) {
					do {
					   HashMap mapOutput = new HashMap();    
					   for(JCoFieldIterator e = temptable.getFieldIterator(); e.hasNextField(); ) {
						   JCoField field = e.nextField();
						   //mapOutput.put(field.getName(), field.getString());
						   logger.debug("Col : "+field.getName()+"[ "+field.getString() +" ]");
					   }
				                
				                
					} while(temptable.nextRow());
				}

				
			}
			
			// 최종시간
			//logs.append("\n\nSAP RFC FUNCTION -- END TIME ").append(System.currentTimeMillis() - startTime);
			return logs.toString();
		}
		
		/**
		 * 테이블 갯수를 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @return
		 */
		public int getTableCount() {
			if (tables == null) {
				tables = function.getTableParameterList();
			}
			return tables.getFieldCount();
		}
		
		/**
		 * 테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param index
		 * @return
		 * @throws Exception
		 */
		public <T> List<T> getTable(int index, final Class<T> T) throws Exception {
			return getTable(index, null, T);
		}
		
		/**
		 *  테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param name
		 * @param T
		 * @return
		 * @throws Exception
		 */
		public <T> List<T> getTable(String name, final Class<T> T) throws Exception {
			return getTable(0, name, T);
		}
		
		public <T> List<T> getTable(int tableIndex, String tableName, final Class<T> T) throws Exception {
			final SimpleDateFormat ymdhms = new SimpleDateFormat("yyyyMMddHHmmss");
			
			/**
			 * java 8 lambda 익명 클래스를
			 * java 7 방식대로 인터페이스 구현한 객체
			 * */			
			return getTable(tableIndex, tableName, new ColumnDefiner<Field[]>() {

				@Override
				public Field[] call(String[] cols) throws Exception {
					Field[] cdo = new Field[cols.length];
					
					for (int i = 0 ; i < cols.length ; i++) {
						try {
							Field field = T.getDeclaredField(underscoreToCamel(cols[i]));
							field.setAccessible(true);
							cdo[i] = field;
						} catch (NoSuchFieldException e) {
							// 필드가 없는것은 무시한다.
						}
					}
					
					return cdo;
				}
				
			}, new RowMapper<Field[], T>() {

				@Override
				public T call(Field[] fields, String[] keys,
						Object[] values) throws Exception {
					T t = T.newInstance();
					for (int i = 0 ; i < fields.length ; i++) {
						Field field = fields[i];
						if (field != null) {
							Object val = values[i];
							if (val != null) {
								switch (val.getClass().getName()) {
									case "java.util.Date" : field.set(t, ymdhms.format((Date)val)); break;
									default : field.set(t, val.toString());
								}
							}
						}
					}
					return t;
				}
				
			});
		}
		
		/**
		 * 테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param tableIndex tableName가 null 인경우 해당 인덱스의 테이블을 가져옵니다.
		 * @param tableName 테이블을 이름으로 가져옵니다. (우선순위)
		 * @param columnDefiner
		 * @param rowMapper
		 * @return
		 * @throws Exception
		 */
		public <CDO, RC> List<RC> getTable(int tableIndex, String tableName, ColumnDefiner<CDO> columnDefiner, RowMapper<CDO, RC> rowMapper) throws Exception {
			
			// 체크
			if (getTableCount() <= tableIndex) {
				throw new IllegalArgumentException("out of table index [" + tableIndex + "/" + getTableCount() + "]");
			}
			
			// 선언
			List<RC> list = new ArrayList<>();
			JCoTable table = tableName != null ? tables.getTable(tableName) : tables.getTable(tableIndex);
			
			// 로우가 있는지 확인
			if (table != null && table.isFirstRow()) {
				
				// 필드를 구합니다.
				List<String> columnList = new ArrayList<>();
				JCoFieldIterator columnIterator = table.getFieldIterator();
				while (columnIterator.hasNextField()) {
					columnList.add(columnIterator.nextField().getName());
				}
				String[] columns = columnList.toArray(new String[columnList.size()]);
				int columnLength = columns.length;
				// 컬럼 디파이너를 부릅니다. Column Definer Object
				CDO cdo;
				if (columnDefiner != null) {
					cdo = columnDefiner.call(columns);
				} else {
					cdo = null;
				}
				
				do {
					
					int valueIndex = 0;
					Object[] values = new Object[columnLength];
					JCoFieldIterator valueIterator = table.getFieldIterator();
					
					while (valueIterator.hasNextField()) {
						values[valueIndex++] = valueIterator.nextField().getValue();
					}
					
					list.add(rowMapper.call(cdo, columns, values));
					
				} while (table.nextRow());
			}
			
			return list;
		}
		
		// 언더스코어를 카멜로 바꿉니다.
		private String underscoreToCamel(String val) {
			char[] c = val.toLowerCase().toCharArray();
			char[] d = new char[c.length];
			int p = 0;
			for (int i = 0 ; i < c.length ; i++) {
				if (c[i] == '_') {
					c[i+1] = Character.toUpperCase(c[i+1]);
					continue;
				}
				d[p++] = c[i];
			}
			return new String(d, 0, p);
		}
		
		/**
		 * 테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param index
		 * @return
		 * @throws Exception
		 */
		public List<Map<String, Object>> getTableMap(int index) throws Exception {
/*			
			return getTable(index, null, null, (cdo, keys, values) -> {
				Map<String, Object> map = new LinkedHashMap<>();
				for (int i = 0 ; i < keys.length ; i++) {
					map.put(keys[i], values[i]);
				}
				return map;
			});
*/			
			return getTable(index, null, null, new RowMapper<Object, Map<String, Object>>() {

				@Override
				public Map<String, Object> call(Object cdo, String[] keys, Object[] values) throws Exception {
					Map<String, Object> map = new LinkedHashMap<>();
					for (int i = 0 ; i < keys.length ; i++) {
						map.put(keys[i], values[i]);
					}
					return map;
				}
				
			});
		}
		
		/**
		 * 모든 테이블을 맵으로 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @return
		 * @throws Exception
		 */
		public List<List<Map<String, Object>>> getAllTableMapList() throws Exception {
			List<List<Map<String, Object>>> list = new ArrayList<>();
			int tableCount = getTableCount();
			for (int i = 0 ; i < tableCount ; i++) {
				list.add(getTableMap(i));
			}
			return list;
		}
		
		
		public JCoTable JCoTables(String s_tableName) {		
			//if (function.gett)
			JCoTables = function.getTableParameterList().getTable(s_tableName);			
			return JCoTables;
		}
		
		public JCoTable JCoTables() {
			if (JCoTables == null) {
				//JCoTables = function.getTableParameterList().getTable(s_tableName);
			}
			return JCoTables;
		}
		
		
		public List<HashMap<String, Object>> getAllTableData() throws Exception {
			
			List<HashMap<String, Object>> list = new ArrayList<>();
			JCoTable temptable = JCoTables;						
			if(temptable.getNumRows() > 0) {
				do {
				   HashMap mapOutput = new HashMap();    
				   for(JCoFieldIterator e = temptable.getFieldIterator(); e.hasNextField(); ) {
					   JCoField field = e.nextField();
					   mapOutput.put(field.getName(), field.getString());
					   logger.debug("Col : "+field.getName()+"[ "+field.getString() +" ]");
				   }
				   
				   list.add(mapOutput);     
			                
				} while(temptable.nextRow());
			}
			
			return list;
		}

		 /**
		  * RFC의 Table Parameter를 설정(LinkedHashMap)
		  * @param String s_tableName
		  *        LinkedHashMap lhm_tableListIn
		  */
		public void setHashMapTableParam(String s_tableName, LinkedHashMap lhm_tableListIn) {
		  
		  /*
		   * INPUT : HashMap -> JCoTable 순으로 데이터를 처리한다.
		   */
			if (lhm_tableListIn != null){
				JCoTable tInput = function.getTableParameterList().getTable(s_tableName);
				
				JCoRecordMetaData recordMetaData = tInput.getRecordMetaData();
		   
				String s_metaName = null, s_hashName = "", s_hashValue="";
				int i_metaLen=0, i_hashLen=0;

				//웹에서 받은 추가 할 데이타 추출 
				Iterator itInput = lhm_tableListIn.keySet().iterator();
				tInput.appendRow();
				while(itInput.hasNext()) {
					String field = (String) itInput.next();
					//RFC Table의 meta정보 추출
					for (int i=0; i< recordMetaData.getFieldCount(); i++) {
						s_metaName = recordMetaData.getName(i);
						i_metaLen  = recordMetaData.getByteLength(i);
						//System.out.println("Field: " + recordMetaData.getName(i) +  " length " + recordMetaData.getByteLength(i) + " offset " + recordMetaData.getByteOffset(i));
		     
						if (field.equals(s_metaName)){ //RFC Table의 컬럼명과 웹화면에서 추출한 데이타명이 같을때 세팅
							tInput.setValue(field, lhm_tableListIn.get(field));
						}
					}
				} 
			}
		}
		
		
	}
	
	/** 연결을 시도합니다. */
	public static SapManagerBinder newSapManagerBinder() {
		return new SapManagerBinder(new Properties());
	}
 
	/**
	 * 커넥터 연결

	 */
	public static class SapManagerBinder {
		
		// 환경
		final Properties properties;
		
		// 내부함수
		SapManagerBinder(Properties properties) {
			this.properties = properties;
		}
		
		/** 바인드 */
		public synchronized SapManagerJ7 bind() throws JCoException, IOException {
			File connectionFile = new File(CONN_FILE_NAME+".jcoDestination");
			if (!connectionFile.exists()) {
				FileOutputStream fos = new FileOutputStream(connectionFile, false);
				properties.store(fos, "make connection file");
				fos.close();
			}
			return new SapManagerJ7();
		}
		
		/** 값 세팅 */
		public SapManagerBinder set(String key, String value) {
			properties.setProperty(key, value);
			return this;
		}
	}
	
	/**
	 * 처음 생성된 Column을 보여주는 뷰입니다.

	 */
	public static interface ColumnDefiner<CDO> {
		CDO call(String[] rows) throws Exception;
	}
	
	/**
	 * 행 매핑

	 */
	public static interface RowMapper<CDO, RC> {
		RC call(CDO columnDefiner, String[] rows, Object[] values) throws Exception;
	}
	
}
