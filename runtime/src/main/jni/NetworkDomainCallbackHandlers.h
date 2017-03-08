//
// Created by pkanev on 3/8/2017.
//

#ifndef NETWORKDOMAINCALLBACKHANDLERS_H
#define NETWORKDOMAINCALLBACKHANDLERS_H


#include <include/v8.h>
#include <v8_inspector/src/inspector/v8-network-agent-impl.h>
#include "JsV8InspectorClient.h"
#include "ArgConverter.h"

namespace tns {
namespace NetworkDomainCallbackHandlers {
static void ResponseReceivedCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {
    if (!args.Data()->IsObject()) {
        return;
    }

    auto isolate = args.GetIsolate();

    v8::HandleScope scope(isolate);

    auto context = isolate->GetCurrentContext();

    v8::Local<v8::Object> argsObj = args.Data()->ToObject();

    if ((!argsObj->Has(context, ArgConverter::ConvertToV8String(isolate, "requestId")).FromMaybe(false) ||
            !argsObj->Has(context, ArgConverter::ConvertToV8String(isolate, "frameId")).FromMaybe(false) ||
            !argsObj->Has(context, ArgConverter::ConvertToV8String(isolate, "loaderId")).FromMaybe(false) ||
            !argsObj->Has(context, ArgConverter::ConvertToV8String(isolate, "timestamp")).FromMaybe(false) ||
            !argsObj->Has(context, ArgConverter::ConvertToV8String(isolate, "type")).FromMaybe(false)) ||
            !argsObj->Has(context, ArgConverter::ConvertToV8String(isolate, "response")).FromMaybe(false)) {
        auto p = 5;
    }

    // TODO: Pete: using deprecated API as this is PoC
    auto requestId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "requestId"))->ToString();
    auto frameId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "frameId"));
    auto loaderId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "loaderId"));
    auto timestamp = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "timestamp"));
    auto type = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "type"))->ToString();
    auto response = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "response"));

    auto networkAgentInstance = V8NetworkAgentImpl::Instance;

    auto responseAsObj = response->ToObject();
    v8::Local<v8::String> responseJson;
    auto maybeResponseJson = v8::JSON::Stringify(context, responseAsObj);

    if (!maybeResponseJson.ToLocal(&responseJson)) {
        auto p = 5;
    }

    auto cstr = ArgConverter::ConvertToString(responseJson).c_str();
    auto protocolResponseJson = protocol::parseJSON(cstr);

    protocol::ErrorSupport errorSupport;

    auto protocolResponseObj = protocol::Network::Response::parse(protocolResponseJson.get(), &errorSupport);

    if (errorSupport.hasErrors()) {
        auto p = 5;
        auto errors = errorSupport.errors();
        auto cerrors = errors.utf8();
        auto v = 5;
    }

    networkAgentInstance->m_frontend.responseReceived(ArgConverter::ConvertToString(requestId).c_str(), "frameId", "loaderId", 12345678, ArgConverter::ConvertToString(type).c_str(), std::move(protocolResponseObj));
}

static void RequestWillBeSentCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {
    auto isolate = args.GetIsolate();

    v8::HandleScope scope(isolate);

    auto context = isolate->GetCurrentContext();

    v8::Local<v8::Object> argsObj = args.Data()->ToObject();

    auto requestId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "requestId"));
    auto frameId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "frameId"));
    auto loaderId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "loaderId"));
    auto url = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "url"))->ToString();
    auto request = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "request"));

    auto networkAgentInstance = V8NetworkAgentImpl::Instance;

    auto requestAsObj = request->ToObject();
    v8::Local<v8::String> requestJson;
    auto maybeRequestJson = v8::JSON::Stringify(context, requestAsObj);

    if (!maybeRequestJson.ToLocal(&requestJson)) {
        auto p = 5;
    }

    auto cstr = ArgConverter::ConvertToString(requestJson).c_str();
    auto protocolRequestJson = protocol::parseJSON(cstr);

    protocol::ErrorSupport errorSupport;

    auto protocolResponseObj = protocol::Network::Request::parse(protocolRequestJson.get(), &errorSupport);
    auto initiator = protocol::Network::Initiator::create().setType("Script").build();

    networkAgentInstance->m_frontend.requestWillBeSent("2", "frameId", "loaderId", ArgConverter::ConvertToString(url).c_str(), std::move(protocolResponseObj), 123456789, std::move(initiator));
}

static void DataReceivedCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {

}

static void LoadingFinishedCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {
    auto isolate = args.GetIsolate();

    v8::HandleScope scope(isolate);

    auto context = isolate->GetCurrentContext();

    v8::Local<v8::Object> argsObj = args.Data()->ToObject();

    auto requestId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "requestId"))->ToString();

    auto networkAgentInstance = V8NetworkAgentImpl::Instance;

    networkAgentInstance->m_frontend.loadingFinished(ArgConverter::ConvertToString(requestId).c_str(), 123456789);
}
}
}


#endif //NETWORKDOMAINCALLBACKHANDLERS_H
