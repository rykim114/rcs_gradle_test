package apps.homepage.batch;


import java.net.InetAddress;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import apps.framework.service.CmService;
import apps.framework.service.SendService;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;

@Component
@Configuration
@EnableScheduling
@SuppressWarnings("rawtypes")
public class TaskBatch extends CmService {
	
	private static final Log	logger = LogFactory.getLog(TaskBatch.class);


	@Autowired
	private SendService sendService;
	
	public boolean isTaskServer(){
		InetAddress ip = null;
		String	sTaskServer	= CmFunction.getStrVal(CmPathInfo.getTASK_SCHEDULER_SERVER());
		//try {
			//InetAddress[] local = InetAddress.getAllByName(InetAddress.getLocalHost().getHostName());
			
			boolean ipchk = false;
			if (sTaskServer.equals("true")){
		
				ipchk = true;
			}
			 
			return	ipchk;
			
		/*} catch (UnknownHostException e) {
			e.printStackTrace();
			return	false;
		}*/
	}


    /*
     * 메일, sms 건수 카운트 일배치 (5시)
     */
	
	/*@Scheduled(cron="0 0/1 * * * ?")*//*1분 테스트*/
	/*@Scheduled(cron="0 0 5 * * ?")*/
    @Scheduled(cron="0 0 5 * * ?")
    //@Scheduled(cron="0 * * * * * ")
    public void batch_sendCountToPms() {
    	if (isTaskServer()) {
    		
    		logger.info("==== Batch sendMailCountToPms Start ======");
    		
    		try {
    			sendService.sendMailCountToPms();
    		}catch (Exception e) {
    			e.printStackTrace();
    		}
    		
    		logger.info("==== Batch sendMailCountToPms End ======");
    		
    		
    		logger.info("==== Batch sendSmSCountToPms Start ======");    		
    		
    		try {
    			sendService.sendSmSCountToPms();
    		}catch (Exception e) {
    			e.printStackTrace();
    		}
    		logger.info("==== Batch sendSmSCountToPms End ======");
    	}
    }
    
}