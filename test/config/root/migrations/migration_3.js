

export default (Module) => {
  const {
    initialize, partOf, nameBy, meta, method
  } = Module.NS;

  @initialize
  @partOf(Module)
  class Migration3 extends Module.NS.Migration {
    @nameBy static  __filename = 'Migration3';
    @meta static object = {};
    @method static change() {}
  }
}
