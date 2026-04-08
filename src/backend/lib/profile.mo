import Types "../types/profile";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type State = Map.Map<Principal, Types.UserProfile>;

  public func saveProfile(
    state : State,
    caller : Principal,
    profile : Types.UserProfile,
  ) : Common.Result<(), Text> {
    let stored = { profile with id = caller; createdAt = Time.now() };
    state.add(caller, stored);
    #ok(());
  };

  public func getProfile(
    state : State,
    caller : Principal,
  ) : ?Types.UserProfile {
    state.get(caller);
  };

  public func updateProfile(
    state : State,
    caller : Principal,
    updates : Types.ProfileUpdate,
  ) : Common.Result<(), Text> {
    switch (state.get(caller)) {
      case null { #err("Profile not found. Please create your profile first.") };
      case (?existing) {
        let updated : Types.UserProfile = {
          existing with
          name = switch (updates.name) { case (?v) v; case null existing.name };
          age = switch (updates.age) { case (?v) v; case null existing.age };
          dob = switch (updates.dob) { case (?v) ?v; case null existing.dob };
          heightCm = switch (updates.heightCm) { case (?v) v; case null existing.heightCm };
          weightKg = switch (updates.weightKg) { case (?v) v; case null existing.weightKg };
          city = switch (updates.city) { case (?v) v; case null existing.city };
          lifeStage = switch (updates.lifeStage) { case (?v) v; case null existing.lifeStage };
        };
        state.add(caller, updated);
        #ok(());
      };
    };
  };
};
