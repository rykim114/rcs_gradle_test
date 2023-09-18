package apps.framework.controller;


import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mobile.device.Device;
import org.springframework.mobile.device.DeviceUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.view.AbstractUrlBasedView;
import org.springframework.web.servlet.view.InternalResourceView;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import apps.framework.utils.CmFunction;

public class MobileInternalResourceViewResolver extends InternalResourceViewResolver {
	private Logger logger = LoggerFactory.getLogger(MobileInternalResourceViewResolver.class);

	@Override
	protected AbstractUrlBasedView buildView(String viewName) throws Exception {
		Device device = DeviceUtils.getCurrentDevice(RequestContextHolder.currentRequestAttributes());
		if (device.isMobile()) {
			viewName = getMobileViewName(viewName);
		}
		logger.debug("ViewName : {}", viewName);
		return (InternalResourceView) super.buildView(viewName);
	}

	private String getMobileViewName(String viewName) {
		
		HttpServletRequest 	request = CmFunction.getCurrentRequest();
		
		String	uri	= request.getRequestURI();
		String	url	= request.getRequestURL().toString();
		
		logger.debug("uri : {}", uri);
		logger.debug("url : {}", url);
		
		return viewName + "/m";  // 모바일 경로는  xxx.do/m/xxxx
	}

	@Override
	protected Object getCacheKey(String viewName, Locale locale) {
		Device device = DeviceUtils.getCurrentDevice(RequestContextHolder.currentRequestAttributes());
		if (device.isMobile()) {
			return super.getCacheKey(getMobileViewName(viewName), locale);
		} else {
			return super.getCacheKey(viewName, locale);
		}
	}
}
