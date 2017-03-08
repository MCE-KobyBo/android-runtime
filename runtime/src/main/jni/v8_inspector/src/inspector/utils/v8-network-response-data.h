//
// Created by pkanev on 3/7/2017.
//

#ifndef V8_NETWORK_RESPONSE_H
#define V8_NETWORK_RESPONSE_H

#include <v8_inspector/src/inspector/protocol/Network.h>

namespace v8_inspector {
namespace utils {

namespace NetworkResponse {
static std::unique_ptr<protocol::Network::Response> create(protocol::String& url,
        double status, protocol::String& statusText,
        std::unique_ptr<protocol::Network::Headers> headers,
        protocol::String& mimeType) {
    return protocol::Network::Response::create()
           .setUrl(url)
           .setStatus(status)
           .setStatusText(statusText.)
           .setHeaders(std::move(headers))
           .setMimeType(mimeType)
           .build();
};
};
}
}

#endif //V8_NETWORK_RESPONSE_H
