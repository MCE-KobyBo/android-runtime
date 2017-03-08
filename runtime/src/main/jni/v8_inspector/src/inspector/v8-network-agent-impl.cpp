//
// Created by pkanev on 2/22/2017.
//

#include "v8-network-agent-impl.h"

namespace v8_inspector {

namespace NetworkAgentState {
static const char networkEnabled[] = "networkEnabled";
}

V8NetworkAgentImpl::V8NetworkAgentImpl(V8InspectorSessionImpl* session, protocol::FrontendChannel* frontendChannel,
                                       protocol::DictionaryValue* state)
    : Backend(),
      m_session(session),
      m_frontend(frontendChannel, this),
      m_state(state),
      m_enabled(false) {
    Instance = this;
}

V8NetworkAgentImpl::~V8NetworkAgentImpl() {}

void V8NetworkAgentImpl::enable(ErrorString*) {
    if (m_enabled) {
        return;
    }

    m_state->setBoolean(NetworkAgentState::networkEnabled, true);

    m_enabled = true;
}

void V8NetworkAgentImpl::disable(ErrorString*) {
    if (!m_enabled) {
        return;
    }

    m_state->setBoolean(NetworkAgentState::networkEnabled, false);

    m_enabled = false;
}

void V8NetworkAgentImpl::setExtraHTTPHeaders(ErrorString*, std::unique_ptr<protocol::Network::Headers> in_headers) {
    // TODO: Pete: not relevant in mobile context
}

void V8NetworkAgentImpl::getResponseBody(ErrorString*, const String& in_requestId, String* out_body, bool* out_base64Encoded) {
    // TODO: Pete:
}

void V8NetworkAgentImpl::setCacheDisabled(ErrorString*, bool in_cacheDisabled) {
    // TODO: Pete: not relevant in mobile context
}

void V8NetworkAgentImpl::loadResource(const String& in_frameId, const String& in_url, std::unique_ptr<protocol::Network::Backend::LoadResourceCallback> callback) {
    // TODO: Pete:
}

V8NetworkAgentImpl* V8NetworkAgentImpl::Instance;
}