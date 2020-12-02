

export default (Module) => {
  const {
    initialize, partOf, nameBy, meta, method
  } = Module.NS;

  @initialize
  @partOf(Module)
  class Migration1 extends Module.NS.Migration {
    @nameBy static  __filename = 'Migration1';
    @meta static object = {};
    @method static change() {}
  }
}
