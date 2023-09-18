package apps.homepage.admin.controller.gis;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.homepage.admin.service.gis.GisService;

@Controller
@SuppressWarnings({"rawtypes"})
@RequestMapping("/api/gis")
public class GisRestController extends CmController {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	

	@Resource
	MappingJackson2JsonView ajaxMainView;
	
	@Autowired
	GisService gisService;

	RestTemplate restTemplate = new RestTemplate();

	/******************************** 격자 100 * 100 ********************************/

	// 격자의 직선목록
	@SslOn
	@RequestMapping(value="/sqr100GridList", method={RequestMethod.GET})
	public ModelAndView selectSqr100GridList(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			Object blockIdArr = reqVo.get("blockIdArr");

			if (null != blockIdArr) {
				if (! (blockIdArr.getClass().equals(String[].class))) {
					reqVo.put("blockIdArr", Collections.singletonList(blockIdArr));
				}
			}

			gisService.selectSqr100GridList(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}


	// 격자 목록
	@SslOn
	@RequestMapping(value="/sqr100List", method={RequestMethod.GET})
	public ModelAndView selectSqr100List(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			double swLat = reqVo.getDouble("swLat");
			double swLng = reqVo.getDouble("swLng");
			double neLat = reqVo.getDouble("neLat");
			double neLng = reqVo.getDouble("neLng");

			double diffX = neLng - swLng;
			double diffY = neLat - swLat;

			reqVo.put("swLat", swLat - diffY);
			reqVo.put("swLng", swLng - diffX);
			reqVo.put("neLat", neLat + diffY);
			reqVo.put("neLng", neLng + diffX);

			gisService.selectSqr100List(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}


	// 격자 1개 상세
	@SslOn
	@RequestMapping(value="/sqr100GridDetail", method={RequestMethod.GET})
	public ModelAndView selectSqr100GridDetail(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			gisService.selectSqr100GridDetail(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}

	/******************************** 격자 100 * 100 ********************************/

	// 집계구 목록
	@SslOn
	@RequestMapping(value="/outputAreaLineList", method={RequestMethod.GET})
	public ModelAndView selectOutputAreaLineList(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			gisService.selectOutputAreaLineList(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}
	
	@SslOn
	@RequestMapping(value="/outputAreaDetail", method={RequestMethod.GET})
	public ModelAndView selectOutputAreaDetail(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			gisService.selectOutputAreaDetail(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}
	

	// 주소 조회
	@SslOn
	@RequestMapping(value="/address", method={RequestMethod.GET})
	public ModelAndView selectAddressListByText(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			gisService.selectAddressListByText(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}
	
	@SslOn
	@RequestMapping(value="/addressGps", method={RequestMethod.GET})
	public ModelAndView selectAddressByGps(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			gisService.selectAddressByGps(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}


	@SslOn
	@RequestMapping(value="/favorite", method={RequestMethod.POST})
	public ModelAndView updateFavorite(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			Object blockIdArr = reqVo.get("blockIdArr");

			if (null != blockIdArr) {
				if (! (blockIdArr.getClass().equals(String[].class))) {
					reqVo.put("blockIdArr", Collections.singletonList(blockIdArr));
				}
			}

			gisService.updateFavorite(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}


	@SslOn
	@RequestMapping(value="/deleteFavorite", method={RequestMethod.POST})
	public ModelAndView deleteFavorite(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();

		try {
			gisService.deleteFavorite(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
		}

		return new ModelAndView(this.ajaxMainView, model);
	}

	@SslOn
	@RequestMapping(value="/js/dawulMap", method={RequestMethod.GET})
	public ResponseEntity getDawulMapJs(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {

		try {
//			final String baseUrl = "https://vapi.dawulmap.com:8443/MapAppServer/DWService";
			final String baseUrl = "https://rmap.r114.com:8000/MapAppServer/DWService";

			UriComponents uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
		        .queryParam("req", "{'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}")
		        .build();

			HttpHeaders headers = new HttpHeaders();
			
			HttpEntity<String> requestEntity = new HttpEntity<>(headers);

			ResponseEntity<String> result = restTemplate.exchange(uri.toUri(), HttpMethod.GET, requestEntity, String.class);

			HttpHeaders headersCopy = new HttpHeaders();
			
			headersCopy.add("Content-Type", result.getHeaders().getFirst("Content-Type"));
			
			String respBody = result.getBody();
			
			respBody = StringUtils.replaceEach(respBody,
//					new String[]{"http://timgz.dawulmap.com:8040", "http://timgy.dawulmap.com:8040", "http://timgx.dawulmap.com:8040"},
//					new String[]{"https://timgz.dawulmap.com:8443", "https://timgy.dawulmap.com:8443", "https://timgx.dawulmap.com:8443"});
					new String[]{"http://timgb.dawulmap.com:8040"},
					new String[]{"https://timgb.dawulmap.com:8443"});

			ResponseEntity<String> resultCopy = new ResponseEntity<>(respBody, headersCopy, HttpStatus.OK);
			
			return resultCopy;

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}

		return null;
	}
}
