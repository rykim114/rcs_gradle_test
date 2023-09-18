package apps.framework.boot;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class ServletInitializer extends SpringBootServletInitializer {
	
	public ServletInitializer() {
//		this.setRegisterErrorPageFilter(false);
	}


	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {

		// bean 중복 허용
//		builder.initializers(new ApplicationContextInitializer<GenericApplicationContext>() {
//
//			@Override
//			public void initialize(GenericApplicationContext context) {
//				context.setAllowBeanDefinitionOverriding(true);
//			}
//		});

		return builder.sources(Application.class);
	}

	
//	@Override
//	public void onStartup(ServletContext container) throws ServletException {
//		AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
//		context.setConfigLocation("apps.framework.boot.config");
//
//		container.addListener(new ContextLoaderListener(context));
//
//		ServletRegistration.Dynamic dispatcher = container.addServlet("dispatcher", new DispatcherServlet(context));
//
//		dispatcher.setLoadOnStartup(1);
//		dispatcher.addMapping("/");
//	}
}
