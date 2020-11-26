

export default (Module) => {
  const {
    initialize, partOf, nameBy, meta, method
  } = Module.NS;

  @initialize
  @partOf(Module)
  class Migration2 extends Module.NS.Migration {
    @nameBy static __filename = 'Migration2';
    @meta static object = {};
    @method static change() {}
  }
}
