package apps.framework.object;

import java.io.Serializable;

public class CustomUser implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
    private String userId;
    private String userName;
    private String userDesc;
    private String userPassword;
    private String useYesNo;
    private String companyCode;
    private String companyName;
    private String deptCode;
    private String stdYesNo;
    private String stdCode;
    private String loginTime;
    private String logoutTime;
    private String ipAddr;
    private String loginCount;
    private String loginLockYesNo;
    private String deptName;
    private String eMail;
    private String mobileNo;
    private String oldPassword;
    private String pgmCode;
    private String gradeCode;
    private String gradeName;
    private String compDb;
    private String vendorCode;
    private String vendorName;
    private String userTag;
    private String hostName;
    private String passwordUpdate;
    private String passwordExpire;
    private String encPassword;

    public CustomUser()
    {
        oldPassword = "";
        pgmCode = "";
        gradeCode = "";
        gradeName = "";
        compDb = "";
        vendorCode = "";
        vendorName = "";
        userTag = "";
        hostName = "";
        passwordUpdate = "";
        passwordExpire = "";
        encPassword = "";
    }

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public void setUserName(String userName)
    {
        this.userName = userName;
    }

    public String getUserName()
    {
        return userName;
    }

    public void setUserDesc(String userDesc)
    {
        this.userDesc = userDesc;
    }

    public String getUserDesc()
    {
        return userDesc;
    }

    public void setUserPassword(String userPassword)
    {
        this.userPassword = userPassword;
    }

    public String getUserPassword()
    {
        return userPassword;
    }

    public void setuseYesNo(String useYesNo)
    {
        this.useYesNo = useYesNo;
    }

    public String getuseYesNo()
    {
        return useYesNo;
    }

    public void setCompanyCode(String companyCode)
    {
        this.companyCode = companyCode;
    }

    public String getCompanyCode()
    {
        return companyCode;
    }

    public void setCompanyName(String companyName)
    {
        this.companyName = companyName;
    }

    public String getCompanyName()
    {
        return companyName;
    }

    public void setDeptCode(String deptCode)
    {
        this.deptCode = deptCode;
    }

    public String getDeptCode()
    {
        return deptCode;
    }

    public void setstdYesNo(String stdYesNo)
    {
        this.stdYesNo = stdYesNo;
    }

    public String getstdYesNo()
    {
        return stdYesNo;
    }

    public void setstdCode(String stdCode)
    {
        this.stdCode = stdCode;
    }

    public String getstdCode()
    {
        return stdCode;
    }

    public void setLoginTime(String loginTime)
    {
        this.loginTime = loginTime;
    }

    public String getLoginTime()
    {
        return loginTime;
    }

    public void setLogoutTime(String logoutTime)
    {
        this.logoutTime = logoutTime;
    }

    public String getIpAddr()
    {
        return ipAddr;
    }

    public void setIpAddr(String ipAddr)
    {
        this.ipAddr = ipAddr;
    }

    public String getLogoutTime()
    {
        return ipAddr;
    }

    public void setLoginCount(String loginCount)
    {
        this.loginCount = loginCount;
    }

    public String getLoginCount()
    {
        return loginCount;
    }

    public void setLoginLockYesNo(String loginLockYesNo)
    {
        this.loginLockYesNo = loginLockYesNo;
    }

    public String getLoginLockYesNo()
    {
        return loginLockYesNo;
    }

    public void setDeptName(String deptName)
    {
        this.deptName = deptName;
    }

    public String getDeptName()
    {
        return deptName;
    }

    public void setEMail(String eMail)
    {
        this.eMail = eMail;
    }

    public String getEMail()
    {
        return eMail;
    }

    public void setMobileNo(String mobileNo)
    {
        this.mobileNo = mobileNo;
    }

    public String getMobileNo()
    {
        return mobileNo;
    }

    public String getOldPassword()
    {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword)
    {
        this.oldPassword = oldPassword;
    }

    public String getPgmCode()
    {
        return pgmCode;
    }

    public void setPgmCode(String pgmCode)
    {
        this.pgmCode = pgmCode;
    }

    public String getGradeCode()
    {
        return gradeCode;
    }

    public void setGradeCode(String gradeCode)
    {
        this.gradeCode = gradeCode;
    }

    public String getGradeName()
    {
        return gradeName;
    }

    public void setGradeName(String gradeName)
    {
        this.gradeName = gradeName;
    }

    public String getCompDb()
    {
        return compDb;
    }

    public void setCompDb(String compDb)
    {
        this.compDb = compDb;
    }

    public String getVendorCode()
    {
        return vendorCode;
    }

    public void setVendorCode(String vendorCode)
    {
        this.vendorCode = vendorCode;
    }

    public String getVendorName()
    {
        return vendorName;
    }

    public void setUserTag(String userTag)
    {
        this.userTag = userTag;
    }

    public String getUserTag()
    {
        return userTag;
    }

    public void setVendorName(String vendorName)
    {
        this.vendorName = vendorName;
    }

    public String getHostName()
    {
        return hostName;
    }

    public void setHostName(String hostName)
    {
        this.hostName = hostName;
    }

    public String getPasswordUpdate()
    {
        return passwordUpdate;
    }

    public void setPasswordUpdate(String passwordUpdate)
    {
        this.passwordUpdate = passwordUpdate;
    }

    public String getPasswordExpire()
    {
        return passwordExpire;
    }

    public void setPasswordExpire(String passwordExpire)
    {
        this.passwordExpire = passwordExpire;
    }

    public void setEncPassword(String encPassword)
    {
        this.encPassword = encPassword;
    }

    public String getEncPassword()
    {
        return encPassword;
    }
    
	
}
