package me.chaenii.portfolio.infrastructure.spam;

import java.util.regex.Pattern;

/**
 * 방명록 닉네임/내용의 명백한 스팸 패턴을 탐지한다.
 * 오탐을 줄이기 위해 보수적으로(링크/IP 닉네임 정도만) 판단한다.
 */
public final class SpamDetector {

    private SpamDetector() {}

    // 닉네임이 IPv4 주소만으로 이루어진 경우 (관측된 봇 패턴)
    private static final Pattern IPV4_ONLY =
            Pattern.compile("^\\s*(\\d{1,3}\\.){3}\\d{1,3}\\s*$");

    // 링크 패턴: scheme / www. / 흔한 스팸 TLD를 가진 도메인
    private static final Pattern URL = Pattern.compile(
            "(https?://|www\\.|\\b[\\w-]+\\.(com|net|org|ru|cn|io|xyz|top|info|click|link|shop|site)\\b)",
            Pattern.CASE_INSENSITIVE);

    public static boolean isSpam(String nickname, String content) {
        if (nickname != null && IPV4_ONLY.matcher(nickname).matches()) {
            return true;
        }
        if (nickname != null && URL.matcher(nickname).find()) {
            return true;
        }
        // 방명록 내용에 링크가 들어가는 경우는 사실상 스팸으로 본다
        return content != null && URL.matcher(content).find();
    }
}
