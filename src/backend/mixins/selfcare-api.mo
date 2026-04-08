import SelfCareLib "../lib/selfcare";
import SelfCareTypes "../types/selfcare";

mixin () {
  public query func getSelfCareForPhase(phase : Text) : async [SelfCareTypes.SelfCareItem] {
    SelfCareLib.getSelfCareForPhase(phase);
  };
};
