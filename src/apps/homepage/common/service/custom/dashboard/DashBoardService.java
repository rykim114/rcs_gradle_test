package apps.homepage.common.service.custom.dashboard;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.email.CmMail;
import apps.homepage.common.dao.custom.dashboard.DashBoardDao;
import apps.homepage.common.dao.custom.sign.SignDao;

@Service
@SuppressWarnings({"rawtypes", "unchecked"})
public class DashBoardService extends CmService {

	protected final Log	logger = LogFactory.getLog(this.getClass());

	@Autowired
	DashBoardDao dashBoardDao;

	public void selectDashBoardTop(CmMap reqVo, Map<String, Object> model) {
		List<CmResMap> selectDashBoardTop = dashBoardDao.selectDashBoardTop(reqVo);
		
		if (null == selectDashBoardTop) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", selectDashBoardTop);
		}
	}
}
