package apps.framework.boot;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebAppInitializer implements WebApplicationInitializer {
  
    public void onStartup(ServletContext container) throws ServletException {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.setConfigLocation("/WEB-INF/spring/appServlet/servlet-context.xml");
        /*ctx.register(WebMvcConfigurer.class);*/
        ctx.setServletContext(container);
 
        ServletRegistration.Dynamic servlet = container.addServlet("appServlet", new DispatcherServlet(ctx));
        servlet.setLoadOnStartup(1);
        servlet.addMapping("/");        
     }

}
