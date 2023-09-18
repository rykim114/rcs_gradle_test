package apps.framework.utils.email;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.io.Resources;

import apps.framework.object.CmMailVo;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;

public class CmMail {

	private static final Log	logger = LogFactory.getLog(CmMail.class);
	
    private static Properties mailProp;

    private static String mailServerIp;
    private static String mailUserId;
    private static String mailPasswd;
    
    private static String SendEmail;
    private static String SendEmailName;
    

    private static boolean initMailConfig() {
        boolean result = true;

        try {

            if (mailServerIp == null || mailServerIp.equals(""))
                result = getProperties();

        } catch (Exception e) {
            //System.out.println("### CmMail.initMailConfig ###");
            logger.error(e); //e.printStackTrace();
        }

        return result;
    }

    private static boolean initMailer() {

        boolean result = true;

        try {
            mailProp = new Properties();

            mailProp.put("mail.smtp.host", mailServerIp);
            mailProp.put("mail.smtp.auth", "true");
        } catch (Exception e) {
            logger.error(e); //e.printStackTrace();
        }

        return result;
    }

    public static boolean getProperties() {
        boolean result = true;

        try {

            Properties props = Resources.getResourceAsProperties("ezREMS.properties");

            mailServerIp = CmFunction.getStringValue(props.getProperty("MAILER_SERVER"));
            mailUserId = CmFunction.getStringValue(props.getProperty("MAILER_USERID"));
            mailPasswd = CmFunction.getStringValue(props.getProperty("MAILER_PASSWD"));
            
            SendEmail = CmFunction.getStringValue(props.getProperty("SEND_EMAIL"));
            SendEmailName = CmFunction.getStringValue(props.getProperty("SEND_EMAIL_NAME"));
            

        } catch (Exception e) {
            //System.out.println("### CmMail.getProperties ###");
            logger.error(e); //e.printStackTrace();
        }

        return result;
    }

    /**
     * 筌롫뗄��癰귣�沅→묾占�	 * @param fromName
     *
     * @param fromEmail
     * @param to
     * @param cc
     * @param title
     * @param content
     * @return
     */
    public static CmMailVo send(String fromName, String fromEmail, String to, String cc, String title, String content) {
        return send(fromName, fromEmail, to, cc, title, content, null);
    }
    
   public static CmMailVo send(String fromName, String fromEmail, String to, String cc, String title, String content, String[] fileName) {
        CmMailVo rvo = new CmMailVo();       
        rvo.setFlagSend(CmMailVo.SEND_SUCC);        

        if (!initMailConfig()) {
            rvo.setFlagSend(CmMailVo.SEND_ERROR);
            rvo.setError(true);
            rvo.setContent(new StringBuffer("이메일 환경설정 내용을 찾을 수 없습니다.."));
            return rvo;
        }

        if (!initMailer()) {
            rvo.setFlagSend(CmMailVo.SEND_ERROR);
            rvo.setError(true);
            rvo.setContent(new StringBuffer("이메일 서버설정을 완료할 수 없습니다."));
            return rvo;
        }

        
        Session session = null;

        //com.util.CmMail.getProperties();
        try {
        	Properties prop = System.getProperties();
        	//prop.put("mail.smtp.debug", "true");
        	prop.put("mail.transport.protocol", "smtp");
        	
        	/*prop.put("mail.smtp.host", mailServerIp);
        	prop.put("mail.smtp.user", mailUserId);*/
        	prop.put("mail.smtp.port", 25); 
        	prop.put("mail.smtp.auth", "true");
        	prop.put("mail.smtp.starttls.enable", "true");
        	prop.put("mail.smtp.starttls.required", "true");
        	prop.put("mail.smtp.socketFactory.port", 465);
        	prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        	
        	session = Session.getDefaultInstance(prop);
        	/*session = Session.getInstance(prop,
        			  new javax.mail.Authenticator() {
        				protected PasswordAuthentication getPasswordAuthentication() {
        					return new PasswordAuthentication(mailUserId, mailPasswd);
        				}
        			  });
            */
            
        } catch (Exception e) {
            //System.out.println("### CmMail.send ###");
            logger.error(e); //e.printStackTrace();
            rvo.setFlagSend(CmMailVo.SEND_ERROR);
            rvo.setContent(new StringBuffer("이메일세션설정이 잘못되었습니다.."));
            return rvo;
        }

        if (null != fileName) {
            try {
            	
            	
                for (int i = 0; i < fileName.length; i++) {
                	
                	File f = new File(fileName[i]);

            	    // 파일 존재 여부 판단
            	    if (f.isFile()) {
            	    	fileName[i] = java.net.URLDecoder.decode(fileName[i], "UTF-8");
            	    }
            	    else {
            	    	fileName[i] = "";
            	    }
                	
                    
                }
            } catch (Exception e) {
                rvo.setFlagSend(CmMailVo.SEND_ERROR);
                rvo.setContent(new StringBuffer("첨부파일에 이상이 있어 메일을 전송하지 못하였습니다.."));
                return rvo;
            }
        }

        try {

            MimeMessage msg = new MimeMessage(session);
            Multipart mp = new MimeMultipart();
            MimeBodyPart msg_part = new MimeBodyPart();
            

            msg.setContentLanguage(new String[]{"EUC-KR", "8859_1", "UTF-8"});

            if (fromEmail != null && !fromEmail.equals("")) {
                
            	msg.setFrom(new InternetAddress(fromName + "<" + fromEmail + ">"));
            	
            	System.out.println(fromName + "<" + fromEmail + ">");
//            	msg.setFrom(new InternetAddress(fromEmail));
            }else if( SendEmail != null && !SendEmail.equals("")) {  
            	System.out.println(fromName + "<" + fromEmail + ">");
            	msg.setFrom(new InternetAddress(SendEmailName + "<" + SendEmail + ">"));
            	fromEmail = SendEmail;
            } else {

                rvo.setFlagSend(CmMailVo.SEND_ERROR);
                rvo.setContent(new StringBuffer("보내는 사람 주소가 없습니다."));
                return rvo;
            }

            // 스펨메일 방지용으로 추가
            InternetAddress[] address = {new InternetAddress(fromEmail)};
           	msg.setReplyTo(address);

            if (to != null && !to.equals("")) {                
                //to = new String(to.replace(" ", "%20").getBytes("UTF-8"), "8859_1");
                msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));                
            } else {
                rvo.setFlagSend(CmMailVo.SEND_ERROR);
                rvo.setContent(new StringBuffer("받을 사람 주소가 없습니다."));
                return rvo;
            }

            if (cc != null && !"".equals(cc)) {
                cc = new String(cc.replace(" ", "%20").getBytes("UTF-8"), "8859_1");
                msg.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(cc, false));
            }

            if (title != null && !"".equals(title)) {
                msg.setSubject(MimeUtility.encodeText(title, "EUC-KR", "Q"));
            	//msg.setSubject(title);
            } else {
                rvo.setFlagSend(CmMailVo.SEND_ERROR);
                rvo.setContent(new StringBuffer("메일 제목이 없습니다."));
                return rvo;
            }

            if (content != null && !"".equals(content)) {
                msg_part.setContent(content, "text/html; charset=utf-8");
                
            	//msg.setContent(content, "text/html; charset=utf-8");
            	
            } else {
                rvo.setFlagSend(CmMailVo.SEND_ERROR);
                rvo.setContent(new StringBuffer("메일 내용이 없습니다."));
                return rvo;
            }

           mp.addBodyPart(msg_part);

            if (fileName != null) {
                for (int i = 0; i < fileName.length; i++) {
                    if ("".equals(CmFunction.getStringValue(fileName[i]))) {
                        continue;
                    }
                    MimeBodyPart file_part = new MimeBodyPart();
                    //System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + fileName[i]);
                    FileDataSource fds = new FileDataSource(fileName[i]);
                    file_part.setDataHandler(new DataHandler(fds));
                    if (CmPathInfo.getSERVER_TYPE().equals("REAL") || CmPathInfo.getSERVER_TYPE().equals("DEV")){
                    	file_part.setFileName(fds.getName());
                    }else{
                    	file_part.setFileName(MimeUtility.encodeText(fds.getName(), "EUC-KR", "Q"));
                    }
                    
                    mp.addBodyPart(file_part);
                }
                
                
            }
            msg.setContent(mp);
            	
           if (rvo.getFlagSend().equals(CmMailVo.SEND_SUCC)) {

                Transport tr = session.getTransport("smtp");        	   
                tr.connect(mailServerIp, mailUserId, mailPasswd);
                tr.sendMessage(msg, msg.getAllRecipients());
                tr.close();
                
                
            }

        } catch (MessagingException e) {
            //System.out.println("### CmMail.send(MessagingException) ###");
            logger.error(e); //e.printStackTrace();
            rvo.setFlagSend(CmMailVo.SEND_ERROR);
            rvo.setContent(new StringBuffer("### CmMail.send(MessagingException) ###"));
            return rvo;
        } catch (IOException e) {
            //System.out.println("### CmMail.send(IOException) ###");
            logger.error(e); //e.printStackTrace();
            rvo.setFlagSend(CmMailVo.SEND_ERROR);
            rvo.setContent(new StringBuffer("### CmMail.send(IOException) ###"));

            return rvo;
        } catch (Exception e) {
            //System.out.println("### CmMail.send(Exception) ###");
            logger.error(e); //e.printStackTrace();
            rvo.setFlagSend(CmMailVo.SEND_ERROR);
            rvo.setContent(new StringBuffer("### CmMail.send(IOException) ###"));
            return rvo;
        }

        return rvo;
    }
}