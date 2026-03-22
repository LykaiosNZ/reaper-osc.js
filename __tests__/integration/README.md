# Integration Tests

These tests run against a real Reaper instance and are excluded from the normal CI test suite.

## Running

Set the connection environment variables for your setup, then run:

```sh
REAPER_REMOTE_ADDRESS=192.168.1.4 REAPER_REMOTE_PORT=64234 REAPER_LOCAL_PORT=49586 yarn test:integration
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `REAPER_REMOTE_ADDRESS` | `127.0.0.1` | IP address of the machine running Reaper |
| `REAPER_REMOTE_PORT` | `8000` | Port Reaper listens on for incoming OSC commands |
| `REAPER_LOCAL_PORT` | `9000` | Port this client listens on for OSC feedback from Reaper |

## How state sync works

The library communicates over UDP, so there is no connection handshake. Reaper only sends a state burst on startup or when explicitly asked via action 41743 (`refreshControlSurfaces()`). The `waitForSync()` helper in `setup.ts` calls this action and waits for track names to arrive before proceeding. Tests that read state from Reaper call `waitForSync()` in their `beforeAll` block.

All test suites share a single UDP port, so Jest must run in band (`--runInBand`). Each suite creates one `Reaper` client in `beforeAll` and tears it down in `afterAll`.

## Requirements

### Reaper must be running

Reaper must be running and reachable from the machine running the tests.

### OSC control surface must be configured

In Reaper, open **Preferences → Control/OSC/Web** and add a control surface with these settings:

| Setting | Value |
|---|---|
| Control surface mode | OSC (Open Sound Control) |
| Listen port | *(value of `REAPER_REMOTE_PORT`)* |
| Device IP | *(IP of the machine running the tests)* |
| Device port | *(value of `REAPER_LOCAL_PORT`)* |

`Listen port` is where Reaper accepts incoming commands. `Device IP`/`Device port` is where Reaper sends feedback to.

The OSC pattern file must be set to `reaper-osc-js.ReaperOSC` (found in the `patterns/` directory). The bank sizes in the pattern must match the library defaults: **8 tracks**, **8 markers**, and **8 regions** per bank.

After copying or updating the pattern file, reload the control surface (click **Edit** on the surface then **OK**, or restart Reaper) so Reaper picks up any changes to the device counts.

### Reaper project

A project template is provided at `__tests__/integration/ReaperOscJsIntegrationTests.rpp`. Open this in Reaper before running the tests — it is pre-configured with the required tracks, names, and FX.

If you use a different project, it must satisfy the following requirements:

**Tracks**
- At least 9 tracks (bank navigation tests require a second bank with the default bank size of 8)
- Every track must have a unique name
- No track name should use the default `Track{N}` format — the sync detection logic waits for a name that differs from the constructor default
- All tracks start unmuted, unsoloed, and not record-armed
- Track 1 volume at 0 dB (fader position ~0.716) and pan centred

**FX**
- Track 1 must have at least two FX plugins loaded
- The FX plugin in slot 1 must have at least two presets available for navigation

**Sends and receives**
- Track 1 must have at least one send configured (e.g. to a bus or reverb track)
- Track 1 must have at least one receive configured (e.g. from another track)

**Transport**
- Transport stopped at the start of each run
- Project long enough to seek to at least 20 seconds
- Repeat/loop state does not matter — tests toggle and restore both

**Markers and regions**
- At least 2 markers in the project (for bank slot 0 and 1 to be populated)
- At least 1 region in the project
- Marker/region tests gracefully skip if `DEVICE_MARKER_COUNT`/`DEVICE_REGION_COUNT` are 0 in the pattern file, but to fully exercise them, the counts must be set to 8
