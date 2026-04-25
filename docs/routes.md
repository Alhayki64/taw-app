# Tawwa Route Map (v1.0-spec-freeze)

Source of truth for Flutter `go_router` configuration.

| Path | Screen | Protected | Layout |
|------|--------|-----------|--------|
| `/` | WalkthroughScreen | No | Fullscreen |
| `/signup` | SignUpScreen | No | Fullscreen |
| `/signin` | SignInScreen | No | Fullscreen |
| `/forgot-password` | ForgotPasswordScreen | No | Fullscreen |
| `/reset-password` | ResetPasswordScreen | No | Fullscreen |
| `/onboarding/gender` | GenderSelection | No | Fullscreen |
| `/onboarding/age` | AgeSelection | No | Fullscreen |
| `/onboarding/interests` | InterestsSelection | No | Fullscreen |
| `/onboarding/notifications` | NotificationPermission | No | Fullscreen |
| `/home` | HomeScreen | No | MainLayout (bottom nav) |
| `/rewards` | MarketplaceScreen | No | MainLayout (bottom nav) |
| `/profile` | ProfileScreen | No | MainLayout (bottom nav) |
| `/event/:id` | EventDetailsScreen | No | Fullscreen |
| `/checkin-success` | CheckInSuccessScreen | **Yes** | Fullscreen |
| `/rewards/:id` | RewardRedemptionFlow | **Yes** | Fullscreen |
| `/profile/edit` | EditProfile | **Yes** | Fullscreen |
| `/profile/history` | ImpactHistory | **Yes** | Fullscreen |
| `*` | Redirect → `/` | — | — |

## Notes
- **MainLayout** = persistent bottom nav (Home / Rewards / Profile tabs).
- **Protected** = requires active Supabase session; redirect to `/signin` if unauthenticated.
- `/event/:id` is intentionally public so events can be shared via link.
- Deep links deferred to v1.1 — `/checkin-success` and `/rewards/:id` are only reachable from within the app in v1.
