package apps.framework.object;


public class CmMailVo {

    /**
     * YHKANG :: 메일 발송 성공
     */
    public static final String SEND_SUCC = "Y";
    /**
     * YHKANG :: 메일 발송 에러
     */
    public static final String SEND_ERROR = "E";
    /**
     * YHKANG :: 메일 발송 못합 데이터 없음
     */
    public static final String SEND_CANCEL = "C";
    /**
     * YHKANG :: 메일 발송 못합  첨부없음
     */
    public static final String SEND_NOT_FILE = "F";
    /**
     * YHKANG :: 메일 발송전
     */
    public static final String NOT_SEND = "N";

  
    
	
	private String url;
	private String mailCd;
	private String mailType;
	private String title;
	private String userId;
	private String email;
	private StringBuffer content;
	private String flagSend;
    private String sitecd;
    private String langcd;
	private boolean error;
	private int startRownum = 1;
    private int endRownum = 500;
    private int maxErrorCnt = 3; 
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getMailCd() {
		return mailCd;
	}
	public void setMailCd(String mailCd) {
		this.mailCd = mailCd;
	}
	public String getFlagSend() {
		return flagSend;
	}
	public void setFlagSend(String flagSend) {
		this.flagSend = flagSend;
	}
	public boolean isError() {
		return error;
	}
	public void setError(boolean error) {
		this.error = error;
	}
	public String getMailType() {
		return mailType;
	}
	public void setMailType(String mailType) {
		this.mailType = mailType;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public StringBuffer getContent() {
		return content;
	}
	public void setContent(StringBuffer content) {
		this.content = content;
	}
    public String getSitecd() {
        return sitecd;
    }
    public void setSitecd(String sitecd) {
        this.sitecd = sitecd;
    }
    public String getLangcd() {
        return langcd;
    }
    public void setLangcd(String langcd) {
        this.langcd = langcd;
    }
	public int getStartRownum() {
		return startRownum;
	}
	public void setStartRownum(int startRownum) {
		this.startRownum = startRownum;
	}
	public int getEndRownum() {
		return endRownum;
	}
	public void setEndRownum(int endRownum) {
		this.endRownum = endRownum;
	}
	public int getMaxErrorCnt() {
		return maxErrorCnt;
	}
	public void setMaxErrorCnt(int maxErrorCnt) {
		this.maxErrorCnt = maxErrorCnt;
	}
	public boolean isEmpty() {
		boolean result = false;
		
		
		if(getMailType().isEmpty() || getTitle().isEmpty() 
				|| getUserId().isEmpty() || getEmail().isEmpty()
				|| getContent().length() == 0) {
			result = true;
		}
		return result;
	}
	
}
