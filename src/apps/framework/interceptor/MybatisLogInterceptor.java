package apps.framework.interceptor;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultHandler;

import apps.framework.object.CmMap;
import apps.framework.utils.CmPathInfo;

@Intercepts({
    @Signature(type=StatementHandler.class, method="update", args={Statement.class})
    , @Signature(type=StatementHandler.class, method="query", args={Statement.class, ResultHandler.class})
})
public class MybatisLogInterceptor implements Interceptor {

	protected Log	logger	= LogFactory.getLog(this.getClass());
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
	// TODO Auto-generated method stub
        StatementHandler handler = (StatementHandler)invocation.getTarget();
        
        BoundSql boundSql = handler.getBoundSql();
        
        // 쿼리문을 가져온다(이 상태에서의 쿼리는 값이 들어갈 부분에 ?가 있다)
        String sql = boundSql.getSql();
        
        try{
	        // 쿼리실행시 맵핑되는 파라미터를 구한다
	        Object param = handler.getParameterHandler().getParameterObject();
	        
	        if(param == null){				// 파라미터가 아무것도 없을 경우
	            sql = sql.replaceFirst("\\?", "''");
	        }else{						// 해당 파라미터의 클래스가 Integer, Long, Float, Double 클래스일 경우
	            if(param instanceof Integer || param instanceof Long || param instanceof Float || param instanceof Double){
	            	sql = sql.replaceFirst("\\?", param.toString());
	            }else if(param instanceof String){	// 해당 파라미터의 클래스가 String 일 경우(이 경우는 앞뒤에 '(홑따옴표)를 붙여야해서 별도 처리
	            	sql = sql.replaceFirst("\\?", "'" + param + "'");
	            }else if(param instanceof Map){		// 해당 파라미터가 Map 일 경우
	        	
		        	/*
		        	 * 쿼리의 ?와 매핑되는 실제 값들의 정보가 들어있는 ParameterMapping 객체가 들어간 List 객체로 return이 된다.
		        	 * 이때 List 객체의 0번째 순서에 있는 ParameterMapping 객체가 쿼리의 첫번째 ?와 매핑이 된다
		        	 * 이런 식으로 쿼리의 ?과 ParameterMapping 객체들을 Mapping 한다
		        	 */
		        	List<ParameterMapping> paramMapping = boundSql.getParameterMappings();	
		        	
		        	for(ParameterMapping mapping : paramMapping){
		        	    String propValue = mapping.getProperty();		// 파라미터로 넘긴 Map의 key 값이 들어오게 된다
		        	    Object value = ((Map) param).get(propValue);	// 넘겨받은 key 값을 이용해 실제 값을 꺼낸다
		        	    
		        	    if(boundSql.hasAdditionalParameter(propValue)) { 
	                        // 동적 SQL로 인해 __frch_item_0 같은 파라미터가 생성되어 적재됨, additionalParameter로 획득
	                        value = boundSql.getAdditionalParameter(propValue);
	                    } 
		        	    		
		        	    if(value instanceof String){			// SQL의 ? 대신에 실제 값을 넣는다. 이때 String 일 경우는 '를 붙여야 하기땜에 별도 처리
		        	    	sql = sql.replaceFirst("\\?", "'" + value + "'");
		        	    }else{
		        	    	if (value == null){
		        	    		sql = sql.replaceFirst("\\?", "");
		        	    	}else{
		        	    		sql = sql.replaceFirst("\\?", value.toString());
		        	    	}
		        	    }
		        	}
	            }else{					// 해당 파라미터가 사용자 정의 클래스일 경우
	        	
		        	/*
		        	 * 쿼리의 ?와 매핑되는 실제 값들이 List 객체로 return이 된다.
		        	 * 이때 List 객체의 0번째 순서에 있는 ParameterMapping 객체가 쿼리의 첫번째 ?와 매핑이 된다
		        	 * 이런 식으로 쿼리의 ?과 ParameterMapping 객체들을 Mapping 한다
		        	 */
		        	List<ParameterMapping> paramMapping = boundSql.getParameterMappings();
		        	
		        	Class<? extends Object> paramClass = param.getClass();
		        	// logger.debug("paramClass.getName() : {}", paramClass.getName());
		        	for(ParameterMapping mapping : paramMapping){
		        	    String propValue = mapping.getProperty();			// 해당 파라미터로 넘겨받은 사용자 정의 클래스 객체의 멤버변수명
		        	    Field field = paramClass.getDeclaredField(propValue);	// 관련 멤버변수 Field 객체 얻어옴
		        	    field.setAccessible(true);					// 멤버변수의 접근자가 private일 경우 reflection을 이용하여 값을 해당 멤버변수의 값을 가져오기 위해 별도로 셋팅
		        	    Class<?> javaType = mapping.getJavaType();			// 해당 파라미터로 넘겨받은 사용자 정의 클래스 객체의 멤버변수의 타입
		        	    
		        	    if(String.class == javaType){				// SQL의 ? 대신에 실제 값을 넣는다. 이때 String 일 경우는 '를 붙여야 하기땜에 별도 처리
		        	    	sql = sql.replaceFirst("\\?", "'" + field.get(param) + "'");
		        	    }else{
		        	    	
		        	    	if (field.get(param) == null){
		        	    		sql = sql.replaceFirst("\\?", "");
		        	    	}else{
		        	    		sql = sql.replaceFirst("\\?", field.get(param).toString());
		        	    	}
		        	    			        	    	
		        	    }
		        	    
		        	}
	            }
	            
	        }
        }catch(Exception e){
			
        	logger.debug("MybatisLogInterceptor 오류 발생!");
			logger.error(e); //e.printStackTrace();
		}
        
        
        logger.debug("=====================================================================");
        logger.debug("sql : "+ sql);
        logger.debug("=====================================================================");
        
      //if (!sql.substring(0, 6).toLowerCase().equals("select")){
        if (sql.toLowerCase().contains("proc_")  || sql.toLowerCase().contains("insert") || sql.toLowerCase().contains("update") || sql.toLowerCase().contains("delete") ){
        	if (!sql.toLowerCase().contains("xg_sys_svclog")){ 
        			TraceLog(sql);
        	}
        }
        
        return invocation.proceed(); // 쿼리 실행
    }

    @Override
    public Object plugin(Object target) {
	// TODO Auto-generated method stub
	return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
	// TODO Auto-generated method stub

    }
    
    
    private static FileWriter objfile = null;

    public static void TraceLog(String log)
    {
        int i                 = 0;
        String stPath         = "";
        String stFileName     = "";
        
        
        stPath     = CmPathInfo.getSQL_LOG_PATH();
        if (stPath != null || stPath.length() > 1){
	        //stPath     = "/APP_log/pms.ezrems.com/";
	        stFileName = "XG_SQL_LOG";
	        SimpleDateFormat formatter1 = new SimpleDateFormat ("yyyyMMdd");
	        SimpleDateFormat formatter2 = new SimpleDateFormat ("HH:mm:ss");
	        
	        String stDate = formatter1.format(new Date());
	        String stTime = formatter2.format(new Date());
	        StringBuffer bufLogPath  = new StringBuffer();       
	                     bufLogPath.append(stPath);
	                     bufLogPath.append(stFileName);
	                     bufLogPath.append("_");
	                     bufLogPath.append(stDate);
	                     bufLogPath.append(".log") ;
	        StringBuffer bufLogMsg = new StringBuffer(); 
	            bufLogMsg.append("[");
	            bufLogMsg.append(stDate+"  "+stTime);
	            bufLogMsg.append("]\r\n");             
	            bufLogMsg.append(log);
	                     
	        try{
	
	                objfile = new FileWriter(bufLogPath.toString(), true);
	                objfile.write(bufLogMsg.toString());
	                objfile.write("\r\n");
	        }catch(IOException e){
	            
	        }
	        finally
	        {
	            try{
	             objfile.close();
	            }catch(Exception e1){}
	        }
        }
    }
    
}
