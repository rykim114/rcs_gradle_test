package apps.framework.object;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
 
public class CustomUserDetails implements UserDetails, Serializable {
 
    private static final long serialVersionUID = -4450269958885980297L;
    private String username;
    private String password;
    private String captchacode;
    private String account;
     
    public CustomUserDetails(String userName, String password, String captchaCode, String account)
    {
        this.username = userName;
        this.password = password;
        this.captchacode = captchaCode;
        this.account = account;
    }
     
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();   
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
         
        return authorities;
    }
  
    @Override
    public String getPassword() {
        return password;
    }
  
    @Override
    public String getUsername() {
        return username;
    }
    
    
    public String getCaptchaCode() {
    	return captchacode;
    }
    
    public String getAccount() {
    	return account;
    }
  
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
  
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
  
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
  
    @Override
    public boolean isEnabled() {
        return true;
    }
 }
