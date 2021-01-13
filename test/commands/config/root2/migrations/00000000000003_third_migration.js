

export default (Module) => {
  const {
    initialize, partOf, nameBy, meta, method
  } = Module.NS;

  @initialize
  @partOf(Module)
  class ThirdMigration extends Module.NS.TestMigration {
    @nameBy static __filename = 'ThirdMigration';
    @meta static object = {};
    @method static change() {}
  }
}
