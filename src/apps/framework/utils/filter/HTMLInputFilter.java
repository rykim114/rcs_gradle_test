package apps.framework.utils.filter;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * 
 * HTML filtering utility for protecting against XSS (Cross Site Scripting).
 *
 * This code is licensed under a Creative Commons Attribution-ShareAlike 2.5 License
 * http://creativecommons.org/licenses/by-sa/2.5/
 * 
 * This code is a Java port of the original work in PHP by Cal Hendersen.
 * http://code.iamcal.com/php/lib_filter/
 *
 * The trickiest part of the translation was handling the differences in regex handling
 * between PHP and Java.  These resources were helpful in the process:
 * 
 * http://java.sun.com/j2se/1.4.2/docs/api/java/util/regex/Pattern.html
 * http://us2.php.net/manual/en/reference.pcre.pattern.modifiers.php
 * http://www.regular-expressions.info/modifiers.html
 * 
 * A note on naming conventions: instance variables are prefixed with a "v"; global
 * constants are in all caps.
 * 
 * Sample use:
 * String input = ...
 * String clean = new HTMLInputFilter().filter( input );
 * 
 * If you find bugs or have suggestions on improvement (especially regarding 
 * perfomance), please contact me at the email below.  The latest version of this
 * source can be found at
 * 
 * http://josephoconnell.com/java/xss-html-filter/
 *
 * @author Joseph O'Connell <joe.oconnell at gmail dot com>
 * @version 1.0 
 */
@SuppressWarnings("rawtypes")
public class HTMLInputFilter
{	
	
	public static String cleanXSS( String value ) {
        
		String cleanValue = null;
		
		if (value != null) {

			cleanValue = Normalizer.normalize(value, Normalizer.Form.NFD);

			// Avoid null characters
//			cleanValue = cleanValue.replaceAll("\0", "");
			
			// Avoid anything between script tags
			//Pattern scriptPattern = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
			//cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
	 
			// Avoid anything in a src='...' type of expression
			/*Pattern scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

			scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");*/
			
			// Remove any lonesome </script> tag
			Pattern scriptPattern = Pattern.compile("</script>", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

			// Remove any lonesome <script ...> tag
			scriptPattern = Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

			// Avoid eval(...) expressions
			scriptPattern = Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			// Avoid expression(...) expressions
			scriptPattern = Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			// Avoid javascript:... expressions
			scriptPattern = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			// Avoid vbscript:... expressions
			scriptPattern = Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			// Avoid alert:... expressions			
			scriptPattern = Pattern.compile("alert", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			// onerror
			scriptPattern = Pattern.compile("onerror", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			scriptPattern = Pattern.compile("document.cookie", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			scriptPattern = Pattern.compile("iframe", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
						
			// Avoid alert:... expressions			
			scriptPattern = Pattern.compile("onmouseover", Pattern.CASE_INSENSITIVE);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");
			
			// Avoid onload= expressions
			scriptPattern = Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
			cleanValue = scriptPattern.matcher(cleanValue).replaceAll("");

			cleanValue = cleanValue.replaceAll(";", "&#59;");
			
			cleanValue = cleanValue.replaceAll("<", "&lt;");
			cleanValue = cleanValue.replaceAll(">", "&gt;");
			//cleanValue = cleanValue.replaceAll("\"", "&quot;");
			//cleanValue = cleanValue.replaceAll("\\\\", "&#39;");
			//cleanValue = cleanValue.replaceAll("%", "&#37;");
			
			//cleanValue = cleanValue.replaceAll("\\(", "&#40;");
			//cleanValue = cleanValue.replaceAll("\\)", "&#41;");
			//cleanValue = cleanValue.replaceAll("&", "&amp;");
			//cleanValue = cleanValue.replaceAll("[+]", "&#43;");
		/*
		case '<': result.append("&lt;"); break; 
		case '>': result.append("&gt;"); break; 
		case '"': result.append("&quot;"); break; 
		case '\'': result.append("&#39;"); break; 
		case '%': result.append("&#37;"); break;
		 case ';': result.append("&#59;"); break;
		 case '(': result.append("&#40;"); break;
		 case ')': result.append("&#41;"); break; 
		case '&': result.append("&amp;"); break; 
		case '+': result.append("&#43;"); break; 
		*/
		}
		
		//return cleanValue;
		return Normalizer.normalize(cleanValue, Normalizer.Form.NFC);

		//return new HTMLInputFilter().filter(value);
	}
}