import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import Common "../types/common";

mixin (profiles : ProfileLib.State) {
  public shared ({ caller }) func saveProfile(profile : ProfileTypes.UserProfile) : async Common.Result<(), Text> {
    ProfileLib.saveProfile(profiles, caller, profile);
  };

  public shared query ({ caller }) func getProfile() : async ?ProfileTypes.UserProfile {
    ProfileLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func updateProfile(updates : ProfileTypes.ProfileUpdate) : async Common.Result<(), Text> {
    ProfileLib.updateProfile(profiles, caller, updates);
  };
};
