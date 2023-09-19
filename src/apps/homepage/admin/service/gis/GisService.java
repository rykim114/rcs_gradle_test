package apps.homepage.admin.service.gis;

import java.util.List;
import java.util.Map;

import ai.org.apache.commons.logging.Log;
import ai.org.apache.commons.logging.LogFactory;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.homepage.admin.dao.APPS.gis.GisDao;

@Service
@SuppressWarnings({"rawtypes"})
public class GisService extends CmService {

	protected final Log logger = LogFactory.getLog(this.getClass());

	@Autowired
	private GisDao gisDao;

	/******************************** 격자 100 * 100 ********************************/
	public void selectSqr100GridList(CmMap reqVo, Map<String, Object> model) {
		List<CmResMap> sqr100List = null;

		if (null == reqVo.get("blockIdArr")) {
			sqr100List = gisDao.selectSqr100GridList(reqVo);
		} else {
			sqr100List = gisDao.selectSqr100GridByIdList(reqVo);
		}

		if (null == sqr100List) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", sqr100List);
		}
	}

	public void selectSqr100List(CmMap reqVo, Map<String, Object> model) {
		List<CmResMap> sqr100List = gisDao.selectSqr100List(reqVo);

		if (null == sqr100List) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", sqr100List);
		}
	}

	public void selectSqr100GridDetail(CmMap reqVo, Map<String, Object> model) {
		CmResMap sqr100Detail = gisDao.selectSqr100GridDetail(reqVo);

		if (null == sqr100Detail) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", sqr100Detail);
		}
	}
	/******************************** 격자 100 * 100 ********************************/

	public void selectOutputAreaLineList(CmMap reqVo, Map<String, Object> model) {
		List<CmResMap> outputAreaList = gisDao.selectOutputAreaLineList(reqVo);

		if (null == outputAreaList) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", outputAreaList);
		}
	}

	public void selectOutputAreaDetail(CmMap reqVo, Map<String, Object> model) {
		CmResMap outputArea = gisDao.selectOutputAreaDetail(reqVo);

		if (null == outputArea) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", outputArea);
		}
	}


	public void selectAddressByGps(CmMap reqVo, Map<String, Object> model) {
		CmResMap address = gisDao.selectAddressByGps(reqVo);

		if (null == address) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", address);
		}
	}


	public void selectAddressListByText(CmMap reqVo, Map<String, Object> model) {
		List<CmResMap> addressList = gisDao.selectAddressListByText(reqVo);

		if (null == addressList) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", addressList);
		}
	}


	public void updateFavorite(CmMap reqVo, Map<String, Object> model) {
		gisDao.updateFavorite(reqVo);
		
		if (StringUtils.isNotBlank(reqVo.getString("순번"))) {
			gisDao.deleteFavoriteDtl(reqVo);
			
			if (ArrayUtils.isNotEmpty((Object[]) reqVo.get("blockIdArr"))) {
				gisDao.insertFavoriteDtl(reqVo);
			}
		}

		model.put("code", HttpStatus.OK.value());
		model.put("response", reqVo.getString("순번"));
	}	


	public void deleteFavorite(CmMap reqVo, Map<String, Object> model) {
		int result = gisDao.deleteFavorite(reqVo);

		model.put("code", HttpStatus.OK.value());
		model.put("response", result);
	}

}
