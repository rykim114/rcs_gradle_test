package apps.framework.utils.listener;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Registers and unregisters the Oracle JDBC driver.
 * 
 * Use only when the ojdbc jar is deployed inside the webapp (not as an
 * appserver lib)
 */
public class OjdbcDriverRegistrationListener implements ServletContextListener {

    private static final Logger LOG = LogManager.getLogger(OjdbcDriverRegistrationListener.class);
    private Driver driver = null;

    /**
     * Registers the Oracle JDBC driver
     */
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
    	LOG.debug("driver contextInitialized");
    }

    /**
     * Deregisters JDBC driver
     * 
     * Prevents Tomcat 7 from complaining about memory leaks.
     */
    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
    	// ... First close any background tasks which may be using the DB ...
        // ... Then close any DB connection pools ...

        // Now deregister JDBC drivers in this context's ClassLoader:
        // Get the webapp's ClassLoader
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        // Loop through all drivers
        Enumeration<Driver> drivers = DriverManager.getDrivers();
        while (drivers.hasMoreElements()) {
            Driver driver = drivers.nextElement();
            if (driver.getClass().getClassLoader().equals(cl)) {
                // This driver was registered by the webapp's ClassLoader, so deregister it:
                try {
                	LOG.info("Deregistering JDBC driver {}", driver);
                    DriverManager.deregisterDriver(driver);
                } catch (SQLException ex) {
                	LOG.error("Error deregistering JDBC driver {}", driver, ex);
                }
            } else {
                // driver was not registered by the webapp's ClassLoader and may be in use elsewhere
            	LOG.trace("Not deregistering JDBC driver {} as it does not belong to this webapp's ClassLoader", driver);
            }
        }

    }

}