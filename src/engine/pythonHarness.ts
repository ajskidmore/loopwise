/**
 * Python harness executed inside Pyodide (browser worker AND the Node content tests).
 * Defines __lw_run(src, tests_json, stdin) -> JSON string of RunResult.
 *
 * Tests run in a COPY of the learner's globals, with two extra names:
 *   __output__  everything the program printed
 *   __source__  the learner's source code
 */
export const PY_HARNESS = String.raw`
import sys, io, traceback, json

def __lw_format_error(e):
    if isinstance(e, SyntaxError):
        return "".join(traceback.format_exception_only(type(e), e)).rstrip()
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "main.py"]
    lines = []
    if frames:
        lines.append("Traceback (most recent call last):")
        for f in frames:
            lines.append(f'  File "main.py", line {f.lineno}')
            if f.line:
                lines.append("    " + f.line)
    lines.append("".join(traceback.format_exception_only(type(e), e)).rstrip())
    return "\n".join(lines)

def __lw_run(src, tests_json, stdin_text):
    tests = json.loads(tests_json)
    out = io.StringIO()
    saved = (sys.stdout, sys.stderr, sys.stdin)
    sys.stdout = out
    sys.stderr = out
    sys.stdin = io.StringIO(stdin_text or "")
    g = {"__name__": "__main__"}
    error = None
    try:
        exec(compile(src, "main.py", "exec"), g)
    except SystemExit:
        pass
    except BaseException as e:
        error = __lw_format_error(e)
    finally:
        sys.stdout, sys.stderr, sys.stdin = saved
    output = out.getvalue()
    results = []
    if error is None:
        for t in tests:
            tg = dict(g)
            tg["__output__"] = output
            tg["__source__"] = src
            try:
                exec(t["code"], tg)
                results.append({"name": t["name"], "passed": True})
            except AssertionError as e:
                results.append({"name": t["name"], "passed": False, "message": str(e) or "Check failed"})
            except Exception as e:
                results.append({"name": t["name"], "passed": False, "message": f"{type(e).__name__}: {e}"})
    return json.dumps({"output": output, "error": error, "tests": results})
`;
