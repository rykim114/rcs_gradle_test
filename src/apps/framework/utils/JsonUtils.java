package apps.framework.utils;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import net.sf.json.JSONArray;

public class JsonUtils {
	
//	private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);

    private static final Logger logger = LogManager.getLogger(JsonUtils.class);
	public JsonUtils()
    {
    }

    public static String toJsonStr(Object obj)
    {
        String rv = null;
        try
        {
            if(obj != null)
            {
            	
            	JSONArray jsonArray = JSONArray.fromObject(obj);
            	rv = jsonArray.toString().replace("/null/g","");		
			
            } else
            {
                rv = "{}";
            }
        }
        catch(Exception e)
        {
            logger.error(e.getMessage());
            rv = "{}";
        }
        return rv;
    }

    public static Object fromJsonStr(String jsonStr)
    {
        Object natural = null;
        try
        {
        	JSONArray jsonArray = JSONArray.fromObject(jsonStr);
        	natural = jsonArray.toString().replace("/null/g","");
        }
        catch(Exception e)
        {
            logger.error("Error : {} \n {} ", new Object[] { e.getMessage(), jsonStr });
        }
        return natural;
    }
}
