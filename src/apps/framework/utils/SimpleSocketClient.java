package apps.framework.utils;

import java.awt.Robot;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.UnknownHostException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class SimpleSocketClient {
	
	protected Log	logger	= LogFactory.getLog(this.getClass());
	
	private Socket socket;
	
	private OutputStream os;
	private InputStream is;
	
	private OutputStreamWriter osw;
	private BufferedWriter bw;
    
	private InputStreamReader isr;
	private BufferedReader br;
	
	
	public SimpleSocketClient(){}
	
	public void connect(String ip, int port) throws  UnknownHostException, IOException{
		
		int timeout = 20000;
		//if (CmPathInfo.getPROXY_IP() != "127.0.0.1" && CmPathInfo.getPROXY_SOCKET_PORT() != "8080"){
/*		if (!CmPathInfo.getPROXY_SOCKET_PORT().equals("8080")){
			Proxy proxy = new Proxy (Proxy.Type.SOCKS, new InetSocketAddress(CmPathInfo.getPROXY_IP(),Integer.parseInt(CmPathInfo.getPROXY_SOCKET_PORT())));
			
			socket = new Socket(proxy);
			SocketAddress conip =  new InetSocketAddress(ip,port);
			socket.connect(conip);
			
		}else{
			
			socket = new Socket( ip, port );
			socket.setSoTimeout(timeout);
		}*/
		
		socket = new Socket( ip, port );
		socket.setSoTimeout(timeout);
		
		logger.info("<=== Socket 생성 ====>");
		
		os = socket.getOutputStream();
		is = socket.getInputStream();
	}
	
	public String sendString( String msg ) throws Exception{
		
		String retMsg = null;
				

		try{
			
			logger.info("클라이언트1이 요청함==>"+msg);
			
			
			osw = new OutputStreamWriter(os);
			bw = new BufferedWriter(osw);            //서버로 전송을 위한 OutputStream
			
			
			bw.write(msg);
            //bw.newLine();
			bw.write("\0");
            bw.flush();
            
            isr = new InputStreamReader(is);
            br = new BufferedReader(isr);        // 서버로부터 Data를 받음
            
                      
            char[] buf = new char[4096];
			int len = br.read(buf, 0, 4096);
			//System.out.println("len==>"+len);

			if (len > 0) retMsg = new String(buf, 0, len);
			
            //System.out.println("서버로부터 받은 데이터 : " + retMsg);
			
			logger.info("받은메세지=" +retMsg);
						
            	            		
			return retMsg;
			
			/* 단순한 예제 사용시 
			dos.writeUTF(msg);
			return dis.readUTF();
			*/
		}catch(Exception e){
			
			logger.error(e); //e.printStackTrace();
			//throw e;
			
			return "ERROR";
		}finally {
            try{

            }catch(Exception e){
                logger.error(e); //e.printStackTrace();
            }
        }   
	}
	
	public String onlysendString( String msg ) throws Exception{
		
		String retMsg = null;
				

		try{
			
			logger.info("클라이언트1이 요청함==>"+msg);
			
			
			osw = new OutputStreamWriter(os);
			bw = new BufferedWriter(osw);            //서버로 전송을 위한 OutputStream
			
			String endstr = null;
			bw.write(msg);
            //bw.newLine();
			bw.write("\0");
            bw.flush();
            
            	            		
			return retMsg;
			
			/* 단순한 예제 사용시 
			dos.writeUTF(msg);
			return dis.readUTF();
			*/
		}catch(Exception e){
			
			logger.error(e); //e.printStackTrace();
			//throw e;
			
			return "ERROR";
		}finally {
            try{

            }catch(Exception e){
                logger.error(e); //e.printStackTrace();
            }
        }   
	}

	
	public String receiveString( String msg ) throws Exception{
		
		String retMsg = null;
				

		try{
			
            isr = new InputStreamReader(is);
            br = new BufferedReader(isr);        // 서버로부터 Data를 받음
            
                      
            char[] buf = new char[4096];
			int len = br.read(buf, 0, 4096);
			//System.out.println("len==>"+len);

			if (len > 0) retMsg = new String(buf, 0, len);
			
            //System.out.println("서버로부터 받은 데이터 : " + retMsg);
			
			logger.info("받은메세지=" +retMsg);
						
            	            		
			return retMsg;
			
			/* 단순한 예제 사용시 
			dos.writeUTF(msg);
			return dis.readUTF();
			*/
		}catch(Exception e){
			
			logger.error(e); //e.printStackTrace();
			//throw e;
			
			return "ERROR";
		}finally {
            try{

            }catch(Exception e){
                logger.error(e); //e.printStackTrace();
            }
        }   
	}
	
	
	

	public void close() throws IOException{
		os.close();
		is.close();
		
		bw.close();
        osw.close();
        
        br.close();
        isr.close();
        
		socket.close();
		
		logger.info("<=== Socket close====>");
	}
	
	public static void setTimerOn(int nTimer)  throws Exception  // nTimer - 단위 : 초
	  {
	       int nDelayTime;
	       nDelayTime = nTimer * 1000; // 밀리초 단위에 맞도록 *1000을 해준다.
	       try{
		       Robot tRobot = new Robot();
		       tRobot.delay(nDelayTime);   // delay() 함수를 이용하여 nDelayTime 밀리초 동안 프로세스를 sleep 상태로 만든다.
	       }catch(Exception e){
			
	       }
	 }
}
