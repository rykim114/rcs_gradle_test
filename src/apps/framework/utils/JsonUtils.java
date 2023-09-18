package apps.framework.utils;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.Collection;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

public class JsonUtils {
	
	private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);
	
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
            logger.error("Error : {} \n {} ", new String[] { e.getMessage(), jsonStr });
        }
        return natural;
    }
}
