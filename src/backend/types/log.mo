module {
  public type DailyLog = {
    id : Text;
    date : Text;
    painLevel : ?Nat;
    mood : ?Text;
    symptoms : [Text];
    notes : ?Text;
    createdAt : Int;
  };
};
