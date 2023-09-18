package apps.framework.boot.config;

import java.util.Collections;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.mobile.device.DeviceResolverRequestFilter;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.activeintra.manager.AIReportContextListener;
import com.captcha.botdetect.web.servlet.CaptchaServlet;

import apps.framework.utils.filter.CrossScriptingFilter;
import apps.framework.utils.httpssession.HttpsFilter;
import apps.framework.utils.listener.OjdbcDriverRegistrationListener;
import apps.framework.utils.listener.ezREMSHttpSessionListener;
//import apps.project.utils.listener.XAppContextListener;


@Configuration
//@EnableWebMvc
@ImportResource({
	"/WEB-INF/spring/appServlet/servlet-context.xml",
	"/WEB-INF/config/spring-security-context.xml",
	"/WEB-INF/spring/springrest-servlet.xml"
})
public class WebMvcConfiguration implements WebMvcConfigurer {

    
    
    /**
     * web.xml Filter 이관
     * */
    @Bean
    public FilterRegistrationBean<DelegatingFilterProxy> springSecurityFilterChain() {
        FilterRegistrationBean<DelegatingFilterProxy> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new DelegatingFilterProxy());
        registrationBean.setOrder(1);
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }
    
    @Bean
    public FilterRegistrationBean<AnonymousAuthenticationFilter> anonymousAuthenticationFilter() {
        FilterRegistrationBean<AnonymousAuthenticationFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new AnonymousAuthenticationFilter("anonymousUser"));
        registrationBean.setOrder(1);
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean<CrossScriptingFilter> xss() {
        FilterRegistrationBean<CrossScriptingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new CrossScriptingFilter());
        registrationBean.setOrder(2);
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }

//    @Bean
//    public FilterRegistrationBean<SiteMeshFilter> sitemesh() {
//        FilterRegistrationBean<SiteMeshFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setInitParameters(Collections.singletonMap("sitemesh.configfile", "/WEB-INF/config/sitemesh.xml"));
//
//        registrationBean.setFilter(new SiteMeshFilter());
//
//        registrationBean.addUrlPatterns("/*");
//        return registrationBean;
//    }


    @Bean
    public FilterRegistrationBean<CharacterEncodingFilter> encodingFilter() {
        FilterRegistrationBean<CharacterEncodingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setInitParameters(Collections.singletonMap("encoding", "UTF-8"));

        registrationBean.setFilter(new CharacterEncodingFilter());
        registrationBean.setOrder(3);
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }


    @Bean
    public FilterRegistrationBean<DeviceResolverRequestFilter> deviceResolverRequestFilter() {
        FilterRegistrationBean<DeviceResolverRequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new DeviceResolverRequestFilter());
        registrationBean.setOrder(4);
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean<HttpsFilter> httpsAndhttpSession() {
        FilterRegistrationBean<HttpsFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new HttpsFilter());
        registrationBean.setOrder(5);
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }


    /**
     * web.xml listener 이관
     * */
//    @Bean
//    public ContextLoaderListener contextLoaderListener() {
//    	return new ContextLoaderListener();
//    }

    @Bean
    public RequestContextListener requestContextListener() {
    	return new RequestContextListener();
    }
    
    @Bean
    public ezREMSHttpSessionListener ezREMSHttpSessionListener() {
    	return new ezREMSHttpSessionListener();
    }
    
//    @Bean
//    public XAppContextListener xAppContextListener() {
//    	return new XAppContextListener();
//    }
    
    @Bean
    public OjdbcDriverRegistrationListener ojdbcDriverRegistrationListener() {
    	return new OjdbcDriverRegistrationListener();
    }
    
    @Bean
    public AIReportContextListener aiReportContextListener() {
    	return new AIReportContextListener();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
    	return new HttpSessionEventPublisher();
    }
    
    /**
     * web.xml servlet 이관
     * */
	@Bean
	public ServletRegistrationBean<CaptchaServlet> captchaServletRegistration () {
		ServletRegistrationBean<CaptchaServlet> srb = new ServletRegistrationBean<>();
		srb.setServlet(new CaptchaServlet());
		srb.addUrlMappings("/botdetectcaptcha");
		return srb;
	}

}
