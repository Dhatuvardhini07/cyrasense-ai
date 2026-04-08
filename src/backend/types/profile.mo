module {
  public type UserProfile = {
    id : Principal;
    name : Text;
    age : Nat;
    dob : ?Text;
    heightCm : Float;
    weightKg : Float;
    city : Text;
    lifeStage : Text;
    createdAt : Int;
  };

  public type ProfileUpdate = {
    name : ?Text;
    age : ?Nat;
    dob : ?Text;
    heightCm : ?Float;
    weightKg : ?Float;
    city : ?Text;
    lifeStage : ?Text;
  };
};
