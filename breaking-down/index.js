

function importTest(name, path){
    describe(name, function(){
        require(path);
    });
}

describe("Start testing all units", function(){
    beforeEach(() => console.log("Starting single units..."));
    afterEach(() => console.log("Finish single unit..."));
    
    importTest("Server is running", "./units/server-live");
});