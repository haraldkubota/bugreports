Steps to reproduce:

```
❯ deno --version
deno 1.30.0 (release, x86_64-unknown-linux-gnu)
v8 10.9.194.5
typescript 4.9.4
❯ make
gcc -c -fPIC -o sendeth.o sendeth.c
gcc -shared -W -o libeth.so sendeth.o
❯ sudo RUST_BACKTRACE=1 ~/.deno/bin/deno run --unstable --allow-ffi ffi.ts
12

============================================================
Deno has panicked. This is a bug in Deno. Please report this
at https://github.com/denoland/deno/issues/new.
If you can reliably reproduce this panic, include the
reproduction steps and re-run with the RUST_BACKTRACE=1 env
var set and include the backtrace in your report.

Platform: linux x86_64
Version: 1.30.0
Args: ["/home/harald/.deno/bin/deno", "run", "--unstable", "--allow-ffi", "ffi.ts"]

thread 'main' panicked at 'internal error: entered unreachable code', ext/ffi/call.rs:116:9
stack backtrace:
   0: rust_begin_unwind
             at /rustc/69f9c33d71c871fc16ac445211281c6e7a340943/library/std/src/panicking.rs:575:5
   1: core::panicking::panic_fmt
             at /rustc/69f9c33d71c871fc16ac445211281c6e7a340943/library/core/src/panicking.rs:65:14
   2: core::panicking::panic
             at /rustc/69f9c33d71c871fc16ac445211281c6e7a340943/library/core/src/panicking.rs:115:5
   3: <extern "C" fn(A0) .> R as v8::support::CFnFrom<F>>::mapping::c_fn
   4: _ZN2v88internal12_GLOBAL__N_119HandleApiCallHelperILb0EEENS0_11MaybeHandleINS0_6ObjectEEEPNS0_7IsolateENS0_6HandleINS0_10HeapObjectEEENS8_INS0_20FunctionTemplateInfoEEENS8_IS4_EEPmi
             at ./../../../../v8/src/builtins/builtins-api.cc:112:36
   5: _ZN2v88internal21Builtin_HandleApiCallEiPmPNS0_7IsolateE
             at ./../../../../v8/src/builtins/builtins-api.cc:130:1
   6: Builtins_CEntry_Return1_DontSaveFPRegs_ArgvOnStack_BuiltinExit
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.
```

Not running as root yields the same, except I could not open the raw socket:
```
❯ RUST_BACKTRACE=1 ~/.deno/bin/deno run --unstable --allow-ffi ffi.ts
SIOCGIFINDEX: Bad file descriptor
SIOCGIFHWADDR: Bad file descriptor
-1

============================================================
Deno has panicked. This is a bug in Deno. Please report this
at https://github.com/denoland/deno/issues/new.
If you can reliably reproduce this panic, include the
reproduction steps and re-run with the RUST_BACKTRACE=1 env
var set and include the backtrace in your report.

Platform: linux x86_64
Version: 1.30.0
Args: ["/home/harald/.deno/bin/deno", "run", "--unstable", "--allow-ffi", "ffi.ts"]

thread 'main' panicked at 'internal error: entered unreachable code', ext/ffi/call.rs:116:9
stack backtrace:
   0: rust_begin_unwind
             at /rustc/69f9c33d71c871fc16ac445211281c6e7a340943/library/std/src/panicking.rs:575:5
   1: core::panicking::panic_fmt
             at /rustc/69f9c33d71c871fc16ac445211281c6e7a340943/library/core/src/panicking.rs:65:14
   2: core::panicking::panic
             at /rustc/69f9c33d71c871fc16ac445211281c6e7a340943/library/core/src/panicking.rs:115:5
   3: <extern "C" fn(A0) .> R as v8::support::CFnFrom<F>>::mapping::c_fn
   4: _ZN2v88internal12_GLOBAL__N_119HandleApiCallHelperILb0EEENS0_11MaybeHandleINS0_6ObjectEEEPNS0_7IsolateENS0_6HandleINS0_10HeapObjectEEENS8_INS0_20FunctionTemplateInfoEEENS8_IS4_EEPmi
             at ./../../../../v8/src/builtins/builtins-api.cc:112:36
   5: _ZN2v88internal21Builtin_HandleApiCallEiPmPNS0_7IsolateE
             at ./../../../../v8/src/builtins/builtins-api.cc:130:1
   6: Builtins_CEntry_Return1_DontSaveFPRegs_ArgvOnStack_BuiltinExit
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.
```
