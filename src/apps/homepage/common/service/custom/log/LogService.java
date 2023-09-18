package apps.homepage.common.service.custom.log;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.homepage.common.dao.custom.log.LogDao;

@Service
@SuppressWarnings({"rawtypes", "unchecked"})
public class LogService extends CmService {
	
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	LogDao logDao;
	
	public int insertLogMsg(Map<String, Object> mod) {		
		return logDao.insertLogMsg(mod);
		 
	}
	
	public List<CmResMap> selectLogMsg(Map<String, Object> mod){
		return logDao.selectLogMsg(mod);
	}

}