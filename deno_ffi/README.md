Steps to reproduce:

```
❯ uname -a
Linux t621 5.15.0-58-generic #64-Ubuntu SMP Thu Jan 5 11:43:13 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
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

And here on ARMv8:
```
harald@vim3l:~/git/bugreports/deno_ffi$ uname -a
Linux vim3l 5.9.0-rc2 #0.9.4 SMP PREEMPT Mon Sep 28 16:51:38 CST 2020 aarch64 GNU/Linux
harald@vim3l:~/git/bugreports/deno_ffi$ sudo RUST_BACKTRACE=1 ~/.cargo/bin/deno run --unstable --allow-ffi ffi.ts
12

============================================================
Deno has panicked. This is a bug in Deno. Please report this
at https://github.com/denoland/deno/issues/new.
If you can reliably reproduce this panic, include the
reproduction steps and re-run with the RUST_BACKTRACE=1 env
var set and include the backtrace in your report.

Platform: linux aarch64
Version: 1.29.4
Args: ["/home/harald/.cargo/bin/deno", "run", "--unstable", "--allow-ffi", "ffi.ts"]

thread 'main' panicked at 'internal error: entered unreachable code', /home/ec2-user/.cargo/registry/src/github.com-1ecc6299db9ec823/deno_ffi-0.72.0/call.rs:116:9
stack backtrace:
   0: rust_begin_unwind
             at /rustc/90743e7298aca107ddaa0c202a4d3604e29bfeb6/library/std/src/panicking.rs:575:5
   1: core::panicking::panic_fmt
             at /rustc/90743e7298aca107ddaa0c202a4d3604e29bfeb6/library/core/src/panicking.rs:65:14
   2: core::panicking::panic
             at /rustc/90743e7298aca107ddaa0c202a4d3604e29bfeb6/library/core/src/panicking.rs:115:5
   3: deno_ffi::call::ffi_call_sync
   4: <extern "C" fn(A0) .> R as v8::support::CFnFrom<F>>::mapping::c_fn
   5: _ZN2v88internal12_GLOBAL__N_119HandleApiCallHelperILb0EEENS0_11MaybeHandleINS0_6ObjectEEEPNS0_7IsolateENS0_6HandleINS0_10HeapObjectEEENS8_INS0_20FunctionTemplateInfoEEENS8_IS4_EEPmi
             at ./../../../../v8/src/builtins/builtins-api.cc:112:36
   6: _ZN2v88internal21Builtin_HandleApiCallEiPmPNS0_7IsolateE
             at ./../../../../v8/src/builtins/builtins-api.cc:130:1
   7: Builtins_CEntry_Return1_DontSaveFPRegs_ArgvOnStack_BuiltinExit
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.
```

Same with non-root.

