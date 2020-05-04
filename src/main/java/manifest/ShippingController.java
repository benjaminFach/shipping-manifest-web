package manifest;

import org.springframework.web.bind.annotation.RequestMapping;

public class ShippingController {
    @RequestMapping("/welcome")
    public String loginMessage(){
        return "welcome";
    }
}