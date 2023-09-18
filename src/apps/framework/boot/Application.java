package apps.framework.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.context.annotation.ImportResource;

/*
 * 
 * https://www.baeldung.com/spring-boot-migration
 * */

@SpringBootApplication(
	exclude = {
		SecurityAutoConfiguration.class,
        ManagementWebSecurityAutoConfiguration.class,
        WebMvcAutoConfiguration.class,
//        EnableWebMvcConfiguration.class,
        DataSourceAutoConfiguration.class
	}
)
@ImportResource({
//	"/WEB-INF/spring/root-context.xml",
	"/WEB-INF/spring/datasource-context.xml",
//	"/WEB-INF/spring/message-context.xml",
})
public class Application {
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}


}
