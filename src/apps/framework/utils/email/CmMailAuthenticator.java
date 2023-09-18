package apps.framework.utils.email;

import javax.mail.Authenticator;

public class CmMailAuthenticator extends Authenticator{
	
	private	String	userid;
	private	String	passwd;

	public CmMailAuthenticator(String userid, String passwd) {
		this.userid	= userid;
		this.passwd	= passwd;
	}

	protected javax.mail.PasswordAuthentication getPasswordAuthentication() {
		return new javax.mail.PasswordAuthentication(this.userid, this.passwd);
	}
}
