package com.ethgasviewer.server.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@ToString
@Validated
public class WebErrorDTO {
//    additional: [{headers: {normalizedNames: {}, lazyUpdate: null}, status: 200, statusText: "OK",…}]
    String fileName;
    Integer level;
    String lineNumber;
    String message;
    String timestamp;
}
