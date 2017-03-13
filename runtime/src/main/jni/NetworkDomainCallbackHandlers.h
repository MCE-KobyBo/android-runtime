//
// Created by pkanev on 3/8/2017.
//

#ifndef NETWORKDOMAINCALLBACKHANDLERS_H
#define NETWORKDOMAINCALLBACKHANDLERS_H


#include <include/v8.h>
#include <v8_inspector/src/inspector/v8-network-agent-impl.h>
#include <v8_inspector/src/inspector/utils/base64.h>
#include "JsV8InspectorClient.h"
#include "ArgConverter.h"

namespace tns {
namespace NetworkDomainCallbackHandlers {

static const char* FrameId = "NativeScriptFrameId";
static const char* LoaderId = "NativeScriptLoaderId";

static void ResponseReceivedCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {
    if (!args[0]->IsObject()) {
        return;
    }

    auto isolate = args.GetIsolate();

    v8::HandleScope scope(isolate);

    auto context = isolate->GetCurrentContext();

    v8::Local<v8::Object> argsObj = args[0]->ToObject();

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
    auto frameId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "frameId"))->ToString();
    auto loaderId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "loaderId"))->ToString();
    auto type = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "type"))->ToString();
    auto response = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "response"));
    auto timeStamp = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "timeStamp"))->ToNumber()->IntegerValue();

    auto networkAgentInstance = V8NetworkAgentImpl::Instance;

    auto responseAsObj = response->ToObject();
    v8::Local<v8::String> responseJson;
    auto maybeResponseJson = v8::JSON::Stringify(context, responseAsObj);

    // TODO: Pete: fix
    if (!maybeResponseJson.ToLocal(&responseJson)) {
        auto p = 5;
    }

    // TODO: Pete: fix
    auto cstr = ArgConverter::ConvertToString(responseJson).c_str();
    auto protocolResponseJson = protocol::parseJSON(cstr);

    protocol::ErrorSupport errorSupport;

    auto protocolResponseObj = protocol::Network::Response::parse(protocolResponseJson.get(), &errorSupport);

    auto requestIdString = ArgConverter::ConvertToString(requestId).c_str();
    auto networkRequestData = new v8_inspector::utils::NetworkRequestData();
    networkAgentInstance->m_responses.insert(std::make_pair(requestIdString, networkRequestData));

    networkAgentInstance->m_frontend.responseReceived(requestIdString,
            ArgConverter::ConvertToString(frameId).c_str(),
            ArgConverter::ConvertToString(loaderId).c_str(),
            timeStamp,
            ArgConverter::ConvertToString(type).c_str(),
            std::move(protocolResponseObj));
}

static void RequestWillBeSentCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {
    if (!args[0]->IsObject()) {
        return;
    }

    auto isolate = args.GetIsolate();

    v8::HandleScope scope(isolate);

    auto context = isolate->GetCurrentContext();

    v8::Local<v8::Object> argsObj = args[0]->ToObject();

    auto requestId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "requestId"))->ToString();
    auto frameId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "frameId"))->ToString();
    auto loaderId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "loaderId"))->ToString();
    auto url = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "url"))->ToString();
    auto request = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "request"));
    auto timeStamp = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "timeStamp"))->ToNumber()->IntegerValue();
    auto typeArg = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "type"))->ToString();

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
    auto initiator = protocol::Network::Initiator::create().setType(protocol::Network::Initiator::TypeEnum::Script).build();

    protocol::Maybe<String16> type(ArgConverter::ConvertToString(typeArg).c_str());
    protocol::Maybe<protocol::Network::Response> emptyRedirect;
    networkAgentInstance->m_frontend.requestWillBeSent(ArgConverter::ConvertToString(requestId).c_str(),
            ArgConverter::ConvertToString(frameId).c_str(),
            ArgConverter::ConvertToString(loaderId).c_str(),
            ArgConverter::ConvertToString(url).c_str(),
            std::move(protocolResponseObj),
            timeStamp,
            std::move(initiator),
            emptyRedirect,
            type);
}

static void DataForRequestId(const v8::FunctionCallbackInfo<v8::Value>& args) {
    if (!args[0]->IsObject()) {
        return;
    }

    auto isolate = args.GetIsolate();

    v8::HandleScope scope(isolate);

    auto context = isolate->GetCurrentContext();

    v8::Local<v8::Object> argsObj = args[0]->ToObject();

    auto requestId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "requestId"))->ToString();
    auto data = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "data"))->ToString();
    auto hasTextContent = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "hasTextContent"))->ToBoolean();

    auto networkAgentInstance = V8NetworkAgentImpl::Instance;
    auto requestIdString = ArgConverter::ConvertToString(requestId).c_str();
    auto dataString = ArgConverter::ConvertToString(data);
    auto hasTextContentBool = hasTextContent->BooleanValue();

    auto responses = networkAgentInstance->m_responses;
    auto it = responses.find(requestIdString);

    if (it == responses.end()) {
        // TODO: Pete: fix
        auto c = 5;
    } else {
        v8_inspector::utils::NetworkRequestData* response = it->second;

        if (!hasTextContentBool) {
            response->setData(dataString);
        } else {
            response->setData(ArgConverter::ConvertToString(data));
        }

        response->setHasTextContent(hasTextContentBool);
    }
}

static void LoadingFinishedCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {
    if (!args[0]->IsObject()) {
        return;
    }

    auto isolate = args.GetIsolate();

    v8::HandleScope scope(isolate);

    auto context = isolate->GetCurrentContext();

    v8::Local<v8::Object> argsObj = args[0]->ToObject();

    auto requestId = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "requestId"))->ToString();
    auto timeStamp = argsObj->Get(ArgConverter::ConvertToV8String(isolate, "timeStamp"))->ToNumber()->IntegerValue();

    auto networkAgentInstance = V8NetworkAgentImpl::Instance;

    networkAgentInstance->m_frontend.loadingFinished(ArgConverter::ConvertToString(requestId).c_str(), timeStamp);
}
}
}


#endif //NETWORKDOMAINCALLBACKHANDLERS_H
