package manifest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class ShippingApplication {

	@RequestMapping("/index")
	public String index() {
		return "index";
	}

	public static void main(String[] args) {
		SpringApplication.run(ShippingApplication.class, args);
	}

}
