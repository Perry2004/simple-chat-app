package net.perryz.simple_chat_app.utilities;

import org.springframework.stereotype.Component;

@Component
public class StringUtil {
    public String normalizeString(String input) {
        if (input == null) {
            return null;
        }
        return input.trim().toLowerCase();
    }
}
