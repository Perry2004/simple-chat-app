package net.perryz.simple_chat_app.utilities;

public class Utility {
    public static String normalizeString(String input) {
        if (input == null) {
            return null;
        }
        return input.trim().toLowerCase();
    }
}
