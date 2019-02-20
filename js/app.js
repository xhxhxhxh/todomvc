(function () {
var todos = [
    {
        id: 1,
        title: '看书',
        completed: true
    },
    {
        id: 2,
        title: '写作',
        completed: true
    },
    {
        id: 3,
        title: '运动',
        completed: false
    },
    {
        id: 4,
        title: '打游戏',
        completed: false
    }
];
    //聚焦效果
    Vue.directive('focus',{
        inserted: function (el) {
            el.focus();
        }
    });

    Vue.directive('todoFocus',{
        update: function (el,binding) {
            if (binding.value) {
                el.focus();
            }
        }
    });

var vm = new Vue({
    el: '#app',
    data: {
        todos:JSON.parse(window.localStorage.getItem('todos') || '[]'),
        currentEditing: null,
        currentTodos: ''
    },
    computed: {
        remainingCount: function () {
            // window.localStorage.setItem('todos',JSON.stringify(this.todos));
            return this.todos.filter(item => !item.completed).length
        },
        toggleAllStatus: {
            get: function () {
                return this.todos.every(item => item.completed);
            },
            set: function () {
                // console.log(this.toggleAllStatus);
                var status = !this.toggleAllStatus;
                this.todos.forEach(function (item) {
                    item.completed = status;
                });
            }
        },
        toggleTodos: function () {
            switch (this.currentTodos) {
                case 'active': return this.todos.filter(item => !item.completed); break;
                case 'completed': return this.todos.filter(item => item.completed); break;
                default: return this.todos; break;
            }
        }
    },
    watch: {
        todos: {
            handler: function (val,oldval) {
                // console.log(val,oldval)
                window.localStorage.setItem('todos',JSON.stringify(this.todos));
            },
            deep: true
        }
    },
    methods: {
        //任务添加功能
        addTodos: function (e) {
            // console.log(e.target.value);
            var target = e.target;
            var value = target.value;
            var todos = this.todos;

            if (!value.length) return;
            var todosObj = {
                id: todos.length? todos[todos.length-1].id + 1: 1,
                title: value,
                completed: false
            };
            todos.push(todosObj);
            target.value = '';
        },

        //全选功能
        toggleAllChange: function (e) {
            // console.log(e.target.checked);
            this.todos.forEach(function (item) {
                item.completed = e.target.checked;
            });
        },

        //删除功能
        removeTodos: function (index) {
            this.todos.splice(index,1);
        },

        //编辑功能
        editTodo: function (item) {
            this.currentEditing = item;
        },

        //编辑保持功能
        editSave: function (index,e) {
            var target = e.target;
            var value = target.value;
            var todos = this.todos;

            if (!value.length) {
                todos.splice(index,1);
                return;
            }
            todos[index].title = value;
            this.currentEditing = null;
        },

        //取消编辑功能
        cancelEdit: function () {
            this.currentEditing = null;
        },

        //删除已完成任务
        removeCompleted: function () {
            var todos = this.todos;
            for (var i = todos.length-1; i >= 0; i--) {
                if (todos[i].completed) {
                    todos.splice(i,1);
                }
            }
        }
    }
});
window.onhashchange = function () {
    vm.currentTodos = location.hash.substr(2);
};
window.onhashchange();
})();
