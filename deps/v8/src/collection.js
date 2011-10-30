// Copyright 2011 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


const $Set = global.Set;
const $Map = global.Map;
const $WeakMap = global.WeakMap;

//-------------------------------------------------------------------

function SetConstructor() {
  if (%_IsConstructCall()) {
    %SetInitialize(this);
  } else {
    return new $Set();
  }
}


function SetAdd(key) {
  return %SetAdd(this, key);
}


function SetHas(key) {
  return %SetHas(this, key);
}


function SetDelete(key) {
  return %SetDelete(this, key);
}


function MapConstructor() {
  if (%_IsConstructCall()) {
    %MapInitialize(this);
  } else {
    return new $Map();
  }
}


function MapGet(key) {
  return %MapGet(this, key);
}


function MapSet(key, value) {
  return %MapSet(this, key, value);
}


function MapHas(key) {
  return !IS_UNDEFINED(%MapGet(this, key));
}


function MapDelete(key) {
  if (!IS_UNDEFINED(%MapGet(this, key))) {
    %MapSet(this, key, void 0);
    return true;
  } else {
    return false;
  }
}


function WeakMapConstructor() {
  if (%_IsConstructCall()) {
    %WeakMapInitialize(this);
  } else {
    return new $WeakMap();
  }
}


function WeakMapGet(key) {
  if (!IS_SPEC_OBJECT(key)) {
    throw %MakeTypeError('invalid_weakmap_key', [this, key]);
  }
  return %WeakMapGet(this, key);
}


function WeakMapSet(key, value) {
  if (!IS_SPEC_OBJECT(key)) {
    throw %MakeTypeError('invalid_weakmap_key', [this, key]);
  }
  return %WeakMapSet(this, key, value);
}


function WeakMapHas(key) {
  if (!IS_SPEC_OBJECT(key)) {
    throw %MakeTypeError('invalid_weakmap_key', [this, key]);
  }
  return !IS_UNDEFINED(%WeakMapGet(this, key));
}


function WeakMapDelete(key) {
  if (!IS_SPEC_OBJECT(key)) {
    throw %MakeTypeError('invalid_weakmap_key', [this, key]);
  }
  if (!IS_UNDEFINED(%WeakMapGet(this, key))) {
    %WeakMapSet(this, key, void 0);
    return true;
  } else {
    return false;
  }
}

// -------------------------------------------------------------------

(function () {
  %CheckIsBootstrapping();

  // Set up the Set and Map constructor function.
  %SetCode($Set, SetConstructor);
  %SetCode($Map, MapConstructor);

  // Set up the constructor property on the Set and Map prototype object.
  %SetProperty($Set.prototype, "constructor", $Set, DONT_ENUM);
  %SetProperty($Map.prototype, "constructor", $Map, DONT_ENUM);

  // Set up the non-enumerable functions on the Set prototype object.
  InstallFunctionsOnHiddenPrototype($Set.prototype, DONT_ENUM, $Array(
    "add", SetAdd,
    "has", SetHas,
    "delete", SetDelete
  ));

  // Set up the non-enumerable functions on the Map prototype object.
  InstallFunctionsOnHiddenPrototype($Map.prototype, DONT_ENUM, $Array(
    "get", MapGet,
    "set", MapSet,
    "has", MapHas,
    "delete", MapDelete
  ));

  // Set up the WeakMap constructor function.
  %SetCode($WeakMap, WeakMapConstructor);

  // Set up the constructor property on the WeakMap prototype object.
  %SetProperty($WeakMap.prototype, "constructor", $WeakMap, DONT_ENUM);

  // Set up the non-enumerable functions on the WeakMap prototype object.
  InstallFunctionsOnHiddenPrototype($WeakMap.prototype, DONT_ENUM, $Array(
    "get", WeakMapGet,
    "set", WeakMapSet,
    "has", WeakMapHas,
    "delete", WeakMapDelete
  ));
})();