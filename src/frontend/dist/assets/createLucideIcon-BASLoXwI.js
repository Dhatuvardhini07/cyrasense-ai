var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { e as Subscribable, p as pendingThenable, f as resolveEnabled, s as shallowEqualObjects, g as resolveStaleTime, n as noop, h as environmentManager, i as isValidTimeout, t as timeUntilStale, k as timeoutManager, l as focusManager, m as fetchState, o as replaceData, q as notifyManager, w as hashKey, x as getDefaultState, r as reactExports, y as shouldThrowError, z as useQueryClient, j as jsxRuntimeExports, R as React, A as clsx, c as cn } from "./index-DNVH2Qkg.js";
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a2, _b2;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function calculateCyclePhase(startDate, currentDate, cycleLength = 28, periodDuration = 5) {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const daysDiff = Math.floor(
    (current.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)
  );
  const cycleDay = (daysDiff % cycleLength + cycleLength) % cycleLength + 1;
  if (cycleDay <= periodDuration) return "menstrual";
  const ovulationDay = Math.round(cycleLength / 2) - 2;
  if (cycleDay < ovulationDay - 1) return "follicular";
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 2)
    return "ovulation";
  return "luteal";
}
function getDailyMessage(phase, userName) {
  const firstName = userName.split(" ")[0];
  const messages = {
    menstrual: `Your body is in a recovery phase today, ${firstName}. Focus on rest and hydration — be gentle with yourself.`,
    follicular: `Your energy is building, ${firstName}. A great time to set intentions and move gently toward your goals.`,
    ovulation: `You're in your most vibrant phase, ${firstName}. Embrace your energy and connect with those around you.`,
    luteal: `Your body is preparing, ${firstName}. Nourish yourself with calm activities and good nutrition today.`
  };
  return messages[phase];
}
function getPhaseLabel(phase) {
  const labels = {
    menstrual: "Recovery Phase",
    follicular: "Renewal Phase",
    ovulation: "Peak Energy Phase",
    luteal: "Preparation Phase"
  };
  return labels[phase];
}
function validateHeightWeight(heightCm, weightKg) {
  if (heightCm < 100 || heightCm > 250) {
    return {
      valid: false,
      message: "Please enter a height between 100 cm and 250 cm for accurate tracking."
    };
  }
  if (weightKg < 20 || weightKg > 300) {
    return {
      valid: false,
      message: "Please enter a weight between 20 kg and 300 kg for accurate tracking."
    };
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  if (bmi < 10 || bmi > 60) {
    return {
      valid: false,
      message: "Your entered details seem unusual. Please recheck your height and weight for accuracy."
    };
  }
  return { valid: true };
}
function validateAge(age) {
  if (age < 10 || age > 60) {
    return {
      valid: false,
      message: "Age must be between 10 and 60 for this application."
    };
  }
  return { valid: true };
}
function ftInToCm(feet, inches) {
  return Math.round(feet * 30.48 + inches * 2.54);
}
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
function getPhaseColorClass(phase) {
  const colors = {
    menstrual: "text-cycle-period",
    follicular: "text-primary",
    ovulation: "text-cycle-ovulation",
    luteal: "text-cycle-fertile"
  };
  return colors[phase];
}
const STORAGE_KEYS = {
  PROFILE: "cyrasense_profile",
  CYCLES: "cyrasense_cycles",
  LOGS: "cyrasense_logs",
  CHAT: "cyrasense_chat"
};
function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
async function saveProfile(profile) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const full = {
    ...profile,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  };
  writeStorage(STORAGE_KEYS.PROFILE, full);
  return full;
}
async function getProfile() {
  return readStorage(STORAGE_KEYS.PROFILE);
}
async function updateProfile(update) {
  const existing = readStorage(STORAGE_KEYS.PROFILE);
  if (!existing) return null;
  const updated = {
    ...existing,
    ...update,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  writeStorage(STORAGE_KEYS.PROFILE, updated);
  return updated;
}
async function addCycleRecord(startDate, periodDurationDays, notes) {
  const cycles = readStorage(STORAGE_KEYS.CYCLES) ?? [];
  const sorted = [...cycles].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  let cycleLength;
  if (sorted.length > 0) {
    const prev = sorted[0];
    const days = Math.round(
      (new Date(startDate).getTime() - new Date(prev.startDate).getTime()) / (1e3 * 60 * 60 * 24)
    );
    if (days > 0 && days < 90) cycleLength = days;
  }
  const record = {
    id: crypto.randomUUID(),
    startDate,
    periodDurationDays,
    cycleLength,
    notes,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  writeStorage(STORAGE_KEYS.CYCLES, [...cycles, record]);
  return record;
}
async function getCycleHistory() {
  const cycles = readStorage(STORAGE_KEYS.CYCLES) ?? [];
  return cycles.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}
async function getAverageCycleLength() {
  const cycles = await getCycleHistory();
  const withLength = cycles.filter((c) => c.cycleLength !== void 0);
  if (withLength.length === 0) return 28;
  const sum = withLength.reduce((acc, c) => acc + (c.cycleLength ?? 0), 0);
  return Math.round(sum / withLength.length);
}
async function getCurrentCyclePrediction() {
  const cycles = await getCycleHistory();
  if (cycles.length === 0) return null;
  const latest = cycles[0];
  const avgCycleLength = await getAverageCycleLength();
  const periodDuration = latest.periodDurationDays;
  const today = todayISO();
  const nextStart = addDays(latest.startDate, avgCycleLength);
  const nextEnd = addDays(nextStart, periodDuration - 1);
  const ovulationDate = addDays(
    latest.startDate,
    Math.round(avgCycleLength / 2) - 2
  );
  const fertileStart = addDays(ovulationDate, -2);
  const fertileEnd = addDays(ovulationDate, 2);
  const currentPhase = calculateCyclePhase(
    latest.startDate,
    today,
    avgCycleLength,
    periodDuration
  );
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(latest.startDate).getTime()) / (1e3 * 60 * 60 * 24)
  );
  const currentCycleDay = daysDiff % avgCycleLength + 1;
  return {
    nextPeriodStart: nextStart,
    nextPeriodEnd: nextEnd,
    ovulationDate,
    fertileWindowStart: fertileStart,
    fertileWindowEnd: fertileEnd,
    currentPhase,
    currentCycleDay,
    estimatedCycleLength: avgCycleLength
  };
}
async function saveDailyLog(log) {
  const logs = readStorage(STORAGE_KEYS.LOGS) ?? [];
  const existing = logs.findIndex((l) => l.date === log.date);
  const full = {
    ...log,
    id: crypto.randomUUID(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (existing >= 0) {
    logs[existing] = full;
  } else {
    logs.push(full);
  }
  writeStorage(STORAGE_KEYS.LOGS, logs);
  return full;
}
async function getDailyLogs(startDate, endDate) {
  const logs = readStorage(STORAGE_KEYS.LOGS) ?? [];
  return logs.filter((l) => {
    if (startDate && l.date < startDate) return false;
    if (endDate && l.date > endDate) return false;
    return true;
  });
}
async function getLogForDate(date) {
  const logs = readStorage(STORAGE_KEYS.LOGS) ?? [];
  return logs.find((l) => l.date === date) ?? null;
}
async function analyzeCurrentCycle() {
  const cycles = await getCycleHistory();
  const avgLength = await getAverageCycleLength();
  if (cycles.length === 0) {
    return {
      isNormal: true,
      summary: "No cycle data yet",
      explanation: "Start tracking your cycle to receive personalized insights.",
      recommendation: "Continue monitoring",
      details: [],
      isDelayed: false
    };
  }
  const latest = cycles[0];
  const today = todayISO();
  const daysSincePeriod = Math.floor(
    (new Date(today).getTime() - new Date(latest.startDate).getTime()) / (1e3 * 60 * 60 * 24)
  );
  const isDelayed = daysSincePeriod > avgLength + 5;
  let recommendation = "Continue monitoring";
  if (isDelayed) {
    recommendation = "Consider professional consultation";
  } else if (cycles.length >= 2) {
    const lengths = cycles.filter((c) => c.cycleLength).map((c) => c.cycleLength);
    const variance = lengths.length > 1 ? Math.max(...lengths) - Math.min(...lengths) : 0;
    if (variance > 10) recommendation = "Focus on lifestyle adjustments";
  }
  const details = [];
  if (cycles.length >= 2) {
    const prev = cycles[1];
    if (prev.cycleLength && latest.cycleLength) {
      const diff = latest.cycleLength - prev.cycleLength;
      if (Math.abs(diff) > 3) {
        details.push(
          `Compared to your usual pattern, this cycle is ${diff > 0 ? "slightly longer" : "slightly shorter"}.`
        );
      }
    }
  }
  return {
    isNormal: !isDelayed,
    summary: isDelayed ? "Cycle appears delayed" : "Cycle within normal range",
    explanation: isDelayed ? "Your cycle appears delayed. This can be due to multiple reasons such as stress or hormonal changes. If relevant, you may consider a pregnancy test for clarity." : "This may fall within common variation. If it continues across cycles, consider seeking professional advice.",
    recommendation,
    details,
    isDelayed,
    delayMessage: isDelayed ? "Your cycle appears delayed. This can be due to multiple reasons such as stress or hormonal changes. If relevant, you may consider a pregnancy test for clarity." : void 0
  };
}
async function getMonthlyReport(month, year) {
  const now = /* @__PURE__ */ new Date();
  const reportMonth = now.getMonth() + 1;
  const reportYear = year ?? now.getFullYear();
  const cycles = await getCycleHistory();
  const avgLength = await getAverageCycleLength();
  if (cycles.length === 0) return null;
  const monthStr = `${reportYear}-${String(reportMonth).padStart(2, "0")}`;
  const monthLogs = await getDailyLogs(`${monthStr}-01`, `${monthStr}-31`);
  const avgPain = monthLogs.length > 0 ? monthLogs.reduce((acc, l) => acc + (l.painLevel ?? 0), 0) / monthLogs.length : 0;
  const symptomCounts = {};
  for (const log of monthLogs) {
    for (const s of log.symptoms) {
      symptomCounts[s] = (symptomCounts[s] ?? 0) + 1;
    }
  }
  const latest = cycles[0];
  const cycleLength = latest.cycleLength ?? avgLength;
  return {
    month: monthStr,
    year: reportYear,
    cycleLength,
    averageCycleLength: avgLength,
    patternInsights: [
      cycleLength === avgLength ? "Your cycle length was consistent this month." : `Your cycle length was ${Math.abs(cycleLength - avgLength)} days ${cycleLength > avgLength ? "longer" : "shorter"} than your average.`
    ],
    suggestedNextSteps: [
      "Continue logging daily to improve pattern recognition."
    ],
    symptomSummary: symptomCounts,
    averagePainLevel: Math.round(avgPain * 10) / 10
  };
}
async function sendChatMessage(content) {
  const history = readStorage(STORAGE_KEYS.CHAT) ?? [];
  const userMsg = {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  history.push(userMsg);
  const response = generateChatResponse(content);
  const assistantMsg = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: response,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  history.push(assistantMsg);
  writeStorage(STORAGE_KEYS.CHAT, history);
  return assistantMsg;
}
function generateChatResponse(input) {
  const lower = input.toLowerCase();
  if (!lower.match(
    /cycle|period|ovulat|fertil|pregnan|pms|cramp|discharge|health|body|pain|mood|symptom|tampon|pad|menstrual|hormones|fertility|spotting|flow|pcos|endometriosis|uterus|ovary|progesterone|estrogen|tracking|calendar|flow|bleed|self.?care|wellness|nutrition|exercise/
  )) {
    return "I focus on women's health topics. Let me assist you within that area — feel free to ask about your cycle, symptoms, fertility, or general wellness.";
  }
  if (lower.includes("pain") || lower.includes("cramp")) {
    return "Mild to moderate cramping is common during the menstrual phase as your uterus contracts. Heat therapy, gentle movement, and staying hydrated can help. If pain is severe or disrupting daily activities, consider speaking with a healthcare professional.";
  }
  if (lower.includes("pregnan")) {
    return "Pregnancy is possible during your fertile window, typically 5 days before ovulation and 1 day after. If your period is delayed and you've been sexually active, a home pregnancy test can provide clarity. Remember, delays can also be caused by stress, illness, or hormonal shifts.";
  }
  if (lower.includes("fertil") || lower.includes("ovulat")) {
    return "Your fertile window typically spans about 6 days — the 5 days leading up to ovulation and the day of ovulation itself. Ovulation usually occurs around the midpoint of your cycle. Your CyraSense calendar highlights this window for you.";
  }
  if (lower.includes("pcos")) {
    return "PCOS (Polycystic Ovary Syndrome) can cause irregular cycles, hormonal imbalances, and other symptoms. If you suspect PCOS, tracking your cycles and symptoms here is a great first step. A healthcare professional can provide a proper diagnosis and treatment options.";
  }
  if (lower.includes("delay") || lower.includes("late") || lower.includes("missed")) {
    return "A delayed period can be caused by stress, weight changes, illness, hormonal fluctuations, or pregnancy. Occasional delays of a few days are quite common. If your period is significantly late or this is a recurring pattern, consider speaking with a healthcare professional.";
  }
  if (lower.includes("mood") || lower.includes("emotional")) {
    return "Mood changes throughout your cycle are normal and tied to hormonal shifts. Rising estrogen in the follicular phase often brings a mood lift, while progesterone in the luteal phase can cause fatigue or irritability. Tracking your moods here helps reveal your personal patterns.";
  }
  if (lower.includes("exercise") || lower.includes("workout")) {
    return "Exercise affects your cycle differently by phase. Light movement and walking are gentle during menstruation. Energy peaks during the follicular and ovulation phases — great for more intense workouts. The luteal phase calls for calming activities like yoga or walks.";
  }
  return "That's a great question about women's health. Tracking your cycles, symptoms, and moods regularly gives your body a voice. If you're experiencing any persistent or concerning symptoms, I always recommend consulting with a qualified healthcare professional for personalized guidance.";
}
async function getChatHistory() {
  return readStorage(STORAGE_KEYS.CHAT) ?? [];
}
async function getSelfCareForPhase(phase) {
  const items = {
    menstrual: [
      {
        id: "m1",
        phase: "menstrual",
        category: "exercise",
        title: "Gentle Yoga",
        description: "Restorative poses like child's pose and cat-cow help ease cramps and release tension.",
        icon: "🧘"
      },
      {
        id: "m2",
        phase: "menstrual",
        category: "nutrition",
        title: "Iron-Rich Foods",
        description: "Incorporate leafy greens, lentils, and fortified cereals to replenish iron lost during menstruation.",
        icon: "🥗"
      },
      {
        id: "m3",
        phase: "menstrual",
        category: "hygiene",
        title: "Hygiene & Comfort",
        description: "Change your pad or tampon every 4-6 hours. Consider a heating pad for cramp relief.",
        icon: "🌸"
      },
      {
        id: "m4",
        phase: "menstrual",
        category: "mindfulness",
        title: "Rest & Recharge",
        description: "Your body is working hard. Prioritize sleep and allow yourself to slow down without guilt.",
        icon: "💤"
      },
      {
        id: "m5",
        phase: "menstrual",
        category: "tip",
        title: "Hydration First",
        description: "Drink warm herbal teas like ginger or chamomile to ease bloating and soothe cramping.",
        icon: "🍵"
      }
    ],
    follicular: [
      {
        id: "f1",
        phase: "follicular",
        category: "exercise",
        title: "Cardio & Strength",
        description: "Rising estrogen boosts endurance. This is a great time to try new workouts or increase intensity.",
        icon: "🏃"
      },
      {
        id: "f2",
        phase: "follicular",
        category: "nutrition",
        title: "Fresh & Light Foods",
        description: "Your digestion improves in this phase. Focus on fresh vegetables, salads, and lean proteins.",
        icon: "🥑"
      },
      {
        id: "f3",
        phase: "follicular",
        category: "mindfulness",
        title: "Set Intentions",
        description: "Energy and clarity are building. Journal your goals or start a new project you've been putting off.",
        icon: "📓"
      },
      {
        id: "f4",
        phase: "follicular",
        category: "tip",
        title: "Social Energy",
        description: "Estrogen boosts sociability and communication. Plan meaningful connections during this phase.",
        icon: "✨"
      }
    ],
    ovulation: [
      {
        id: "o1",
        phase: "ovulation",
        category: "exercise",
        title: "High-Intensity Training",
        description: "Peak energy and strength make this the perfect time for HIIT, dancing, or competitive sports.",
        icon: "💪"
      },
      {
        id: "o2",
        phase: "ovulation",
        category: "nutrition",
        title: "Anti-Inflammatory Foods",
        description: "Support your body with omega-3 rich foods like salmon, walnuts, and flaxseed.",
        icon: "🐟"
      },
      {
        id: "o3",
        phase: "ovulation",
        category: "mindfulness",
        title: "Express Yourself",
        description: "This is your most communicative phase. Have important conversations, present ideas, or create art.",
        icon: "🎨"
      },
      {
        id: "o4",
        phase: "ovulation",
        category: "tip",
        title: "Track Cervical Mucus",
        description: "Clear, stretchy mucus similar to egg whites is a natural sign of peak fertility.",
        icon: "🔍"
      }
    ],
    luteal: [
      {
        id: "l1",
        phase: "luteal",
        category: "exercise",
        title: "Calming Movement",
        description: "Pilates, swimming, and gentle walks support your body as it transitions and progesterone rises.",
        icon: "🌊"
      },
      {
        id: "l2",
        phase: "luteal",
        category: "nutrition",
        title: "Magnesium & B6",
        description: "These nutrients help ease PMS symptoms. Find them in dark chocolate, bananas, and avocados.",
        icon: "🍫"
      },
      {
        id: "l3",
        phase: "luteal",
        category: "hygiene",
        title: "Prep & Plan",
        description: "Stock up on period supplies and prepare a comfort kit for the coming phase.",
        icon: "🎒"
      },
      {
        id: "l4",
        phase: "luteal",
        category: "mindfulness",
        title: "Reduce Stress",
        description: "Cortisol and progesterone interact. Practice deep breathing or meditation to manage mood dips.",
        icon: "🌿"
      },
      {
        id: "l5",
        phase: "luteal",
        category: "tip",
        title: "Limit Caffeine & Alcohol",
        description: "These can amplify PMS symptoms. Opt for herbal teas or warm lemon water instead.",
        icon: "☕"
      }
    ]
  };
  return items[phase] ?? [];
}
function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 1e3 * 60 * 5
  });
}
function useSaveProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => saveProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}
function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (update) => updateProfile(update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}
function useCycleHistory() {
  return useQuery({
    queryKey: ["cycles"],
    queryFn: () => getCycleHistory(),
    staleTime: 1e3 * 60 * 2
  });
}
function useCurrentPrediction() {
  return useQuery({
    queryKey: ["prediction"],
    queryFn: () => getCurrentCyclePrediction(),
    staleTime: 1e3 * 60 * 5
  });
}
function useAverageCycleLength() {
  return useQuery({
    queryKey: ["avgCycleLength"],
    queryFn: () => getAverageCycleLength(),
    staleTime: 1e3 * 60 * 5
  });
}
function useAddCycleRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      startDate,
      periodDurationDays,
      notes
    }) => addCycleRecord(startDate, periodDurationDays, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      queryClient.invalidateQueries({ queryKey: ["prediction"] });
      queryClient.invalidateQueries({ queryKey: ["avgCycleLength"] });
      queryClient.invalidateQueries({ queryKey: ["analysis"] });
    }
  });
}
function useLogForDate(date) {
  return useQuery({
    queryKey: ["log", date],
    queryFn: () => getLogForDate(date),
    staleTime: 1e3 * 60 * 2
  });
}
function useSaveDailyLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (log) => saveDailyLog(log),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.invalidateQueries({ queryKey: ["log", variables.date] });
    }
  });
}
function useAnalysis() {
  return useQuery({
    queryKey: ["analysis"],
    queryFn: () => analyzeCurrentCycle(),
    staleTime: 1e3 * 60 * 10
  });
}
function useMonthlyReport(month, year) {
  return useQuery({
    queryKey: ["monthlyReport", month, year],
    queryFn: () => getMonthlyReport(month, year),
    staleTime: 1e3 * 60 * 10
  });
}
function useChatHistory() {
  return useQuery({
    queryKey: ["chat"],
    queryFn: () => getChatHistory(),
    staleTime: 0
  });
}
function useSendChatMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content) => sendChatMessage(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    }
  });
}
function useSelfCare(phase) {
  return useQuery({
    queryKey: ["selfcare", phase],
    queryFn: () => phase ? getSelfCareForPhase(phase) : Promise.resolve([]),
    enabled: !!phase,
    staleTime: 1e3 * 60 * 60
  });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
export {
  useSendChatMessage as A,
  useUpdateProfile as B,
  Card as C,
  composeRefs as D,
  createSlot as E,
  cva as F,
  Slot as S,
  CardContent as a,
  validateHeightWeight as b,
  createLucideIcon as c,
  useProfile as d,
  useCurrentPrediction as e,
  ftInToCm as f,
  formatDate as g,
  getDailyMessage as h,
  getPhaseLabel as i,
  getPhaseColorClass as j,
  useCycleHistory as k,
  useAddCycleRecord as l,
  CardHeader as m,
  CardTitle as n,
  addDays as o,
  useComposedRefs as p,
  useLogForDate as q,
  useSaveDailyLog as r,
  useAnalysis as s,
  todayISO as t,
  useSaveProfile as u,
  validateAge as v,
  useMonthlyReport as w,
  useAverageCycleLength as x,
  useSelfCare as y,
  useChatHistory as z
};
