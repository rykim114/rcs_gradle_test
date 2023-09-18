package apps.homepage.common.utils.core;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import apps.framework.object.CmResMap;



@SuppressWarnings("rawtypes")
public class DataRun {
	private static final Log	logger = LogFactory.getLog(DataRun.class);
	
	public static String getResult(String returnType, List<CmResMap> datalist, String rowSepa, String colSepa, int maxrow)
    {
        if(datalist == null)
            return "";
        if(returnType == null || returnType.equals(""))
            returnType = "array";
        StringBuffer sb = null;
        try
        {
            sb = rsRead(returnType, datalist, rowSepa, colSepa, false, maxrow);
        } catch (Exception ex) {
        	logger.error("getResult Exception===>"+(new StringBuilder("getResult : exception ")).append(ex.getMessage()).append("\r\n").append(ex.getStackTrace().toString()).toString());
			ex.printStackTrace();
		}
        String temp_Str = "";
        if (sb != null ) temp_Str = sb.toString();
        
        
        temp_Str = temp_Str.replaceAll("&#59;", ";");
        temp_Str = temp_Str.replaceAll("&lt;", "<");
        temp_Str = temp_Str.replaceAll("&gt;", ">");

        return temp_Str;
    }
	
	
	public static StringBuffer rsRead(String returnType, List<CmResMap> datalist, String rowSepa, String colSepa, boolean dblq, int maxrow){
        StringBuffer sb = new StringBuffer(0xfa000);
        if(datalist == null)
            return sb;
        int packCnt = 100000;
        int rowCnt = 0;

        if(maxrow == 0)
            maxrow = 0x5f5e0ff;

        if(returnType.toLowerCase().equals("array")){
        	
        	for (int i=0; i<datalist.size();i++){
        		CmResMap datacol = datalist.get(i); 			   
        		if(i != 0) sb.append(rowSepa);
        		
        		int j=0;
        		Iterator iterator = datacol.keySet().iterator();
        		
        		while(iterator.hasNext()){
        			String key = (String)iterator.next();
        			j++;			    			   
        			if(j != 1) sb.append(colSepa);
 			       	
        			try{
	        			if(datacol.get(key) == null)
	        				sb.append("");
	        			else
	        				sb.append(datacol.get(key).toString());
	        			
        			}catch(Exception exception) {
                    	sb.append("");
                    }
        		}

     		  
     	   }
     	   
        }else if(returnType.toLowerCase().equals("xml")) {
            /*sb.append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
            sb.append("<GridData>");
            for(; rs.next() && rowCnt < maxrow; sb.append("</RowData>"))
            {
                rowCnt++;
                sb.append("<RowData>");
                for(int j = 1; j <= conCnt; j++)
                	try{
	                    if(rs.getObject(j) != null)
	                    {
	                        sb.append((new StringBuilder("<")).append(colNames[j - 1]).append(">").toString());
	                        sb.append(rs.getString(j));
	                        sb.append((new StringBuilder("</")).append(colNames[j - 1]).append(">").toString());
	                    } else
	                    {
	                        sb.append((new StringBuilder("<")).append(colNames[j - 1]).append(" />").toString());
	                    }
                	}catch(Exception exception) {
                		sb.append((new StringBuilder("<")).append(colNames[j - 1]).append(" />").toString());
                    }
            }

            sb.append("</GridData>");*/
       } else if(returnType.toLowerCase().equals("json")) {

    	   int size = datalist.size();
    	   DecimalFormat df = new DecimalFormat("0", DecimalFormatSymbols.getInstance(Locale.ENGLISH));
    	   df.setMaximumFractionDigits(340);
    	   
    	   sb.append("[");
    	   
    	   for (int i=0; i<size;i++){
    		   CmResMap datacol = datalist.get(i);
			   
    		   Iterator iterator = datacol.keySet().iterator();
    		   sb.append("{");
    		   int j=0;
    		   while(iterator.hasNext()){
    			   String key = (String)iterator.next();
    			   j++;			    			   
    			   if(j != 1) sb.append(",");
			
    			   sb.append((new StringBuilder("\"")).append(key).append("\":").toString());
    			   if(datacol.get(key) == null) {
    				   sb.append("\"\"");
    			   } else {
    				   StringBuilder col = (new StringBuilder("\""));
    				   Object value = datacol.get(key);
    				   
    				   if (value instanceof Double) {
    					   col.append(df.format(value));
    				   } else {
    					   col.append(value.toString().replace("\"", "\\\""));
    				   }

    				   sb.append(col.append("\"").toString());
    			   }
    		   }
    		   
    		   sb.append("}");
    		   if (i < size - 1){
    			   sb.append(",");
    		   }
    	   }
    	   sb.append("]");
    	 
        } else if(returnType.toLowerCase().equals("json2") || returnType.toLowerCase().equals("jsonwithlower")) {
        	
    		int size = datalist.size();
     	   
			DecimalFormat df = new DecimalFormat("0", DecimalFormatSymbols.getInstance(Locale.ENGLISH));
			df.setMaximumFractionDigits(340);
			
			sb.append("[");
     	   
        	for (int i=0; i<size;i++){
        		CmResMap datacol = datalist.get(i);
 			   
        		if (datacol != null){
	        		Iterator iterator = datacol.keySet().iterator();
	        		sb.append("{");
	        		int j=0;
	        		while(iterator.hasNext()){
	        			String key = (String)iterator.next();
	        			j++;			    			   
	        			if(j != 1) sb.append(",");
	 			
	        			sb.append((new StringBuilder("\"")).append(key.toLowerCase()).append("\":").toString());
	        			if(datacol.get(key) == null) {
	        				sb.append("\"\"");
	        			} else {
							StringBuilder col = (new StringBuilder("\""));
							Object value = datacol.get(key);
							
							if (value instanceof Double) {
								col.append(df.format(value));
							} else {
								col.append(value.toString().replace("\"", "\\\""));
							}
							
							sb.append(col.append("\"").toString());
	        			}
	        		}
	     		   
	        		sb.append("}");
	        		if (i < size - 1){
	        			sb.append(",");
	        		}
        		}
        	}
        	sb.append("]");

        } else if(returnType.toLowerCase().equals("jsonwithid")) {
        	sb.append((new StringBuilder("id")).append(colSepa).toString());
            sb.append((new StringBuilder("num")).append(colSepa).toString());
            sb.append("job");
            
            if (datalist.size() >0){
            	CmResMap datacolname = datalist.get(0);
            	Iterator iterator_name = datacolname.keySet().iterator();
        		 			           		
        		int j=0;
        		while(iterator_name.hasNext()){
        			String key = (String)iterator_name.next();
        			
        			sb.append(colSepa);
                    sb.append(key);  //ColName
        		}        		
        		sb.append(rowSepa);
        		        		 
        		for (int i=0; i<datalist.size();i++){
        			CmResMap datacol = datalist.get(i);
      			   
             		Iterator iterator = datacol.keySet().iterator();
             		sb.append(rowSepa);
             		rowCnt++;
             		sb.append((new StringBuilder("id_")).append(MightyUtility.LPad(rowCnt, "0", 8)).append(colSepa).toString());
                    sb.append((new StringBuilder(String.valueOf(rowCnt))).append(colSepa).toString());
                    sb.append("");
             		
             		while(iterator.hasNext()){
             			String key = (String)iterator.next();
             			
             			sb.append(colSepa);
                        if(datacol.get(key) != null){
                            sb.append(datacol.get(key).toString());
                        }                        
             		}          		   
             	}
            	
            }
            
            
        } else if(returnType.toLowerCase().equals("csv") || returnType.toLowerCase().equals("csvfile")){
            /*while(rs.next() && rowCnt < maxrow) 
            {
                if(++rowCnt != 1)
                    sb.append('\r');
                for(int j = 1; j <= conCnt; j++)
                {
                    if(j != 1)
                        sb.append(",");
                    if(rs.getObject(j) != null)
                        sb.append(rs.getString(j));
                }

            }*/
        }
        return sb;
    }
}
