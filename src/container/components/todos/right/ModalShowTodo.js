// eslint-disable
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Nav, Tab, Button, Modal as ModalBootStrap } from 'react-bootstrap';
import toast from 'react-hot-toast';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { Download } from '../../../helpers';
import { api_update_todo, api_delete_todo } from '../../../api';
import { EditableText } from '../../common/library';
import { PaserDatetimeLocalInput, PaserDatetime_H_M_D_M_Y } from '../../../helpers';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { CHANGE_LIST_TODO } from '../../../reducers/actions';

class ModalShowTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            is_show_repeat_option: false,
            is_show_modal_confirm: false,
            is_show_img_viewer: false,
            photo_attach_view: null,
            input: {
                is_check_time_out: false,
                is_check_remind: false,
                is_check_repeat: false,
                note: '',
                title: '',
            },
            files_pending: [],
            note_t: '',
            todo: {
                is_complete: 0,
                note: [],
                repeat: {
                    type: '', // kiểu
                    option: [], // danh sách ngày tháng
                    option_time: {
                        // số lần, thời gian
                        times: 1,
                        unit: 'week',
                    },
                },
                title: '',
            },
        };

        // const currentDate = new Date();
        // this.currentDate = `${currentDate.getFullYear()}-${
        //     currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth()
        // }-${currentDate.getDate() < 9 ? `0${currentDate.getDate()}` : currentDate.getDate()}T23:00:00.000000Z`;
        this.currentDate = PaserDatetimeLocalInput();
        this.on_change_file = this.on_change_file.bind(this);
    }

    componentDidMount() {
        // this.get_todo();
        const { todo_choose } = this.props;
        if (todo_choose) this.setState({ todo: todo_choose });
    }

    set_loading = (is_load) => {
        this.setState({ loading: is_load });
    };

    // Bật tắt modal confirm
    handle_show_modal_confirm = () => {
        const { is_show_modal_confirm } = this.state;
        this.setState({ is_show_modal_confirm: !is_show_modal_confirm });
    };

    // Show lặp lại
    handle_show_repeat_option = () => {
        const { is_show_repeat_option, is_check_repeat } = this.state;
        this.setState({
            is_show_repeat_option: !is_show_repeat_option,
            is_check_repeat: !is_check_repeat,
        });
    };

    // Thay đổi input của tên tác vụ
    on_change_title_todo = (e) => {
        const { todo } = this.state;
        this.setState({
            todo: {
                ...todo,
                title: e.target.value || '',
            },
        });
    };

    // Cập nhật thời hạn của todo
    handle_change_timeout = (e) => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        todo_t.time_out = e.target.value;
        this.setState({ todo: todo_t });
    };

    // Cập nhật ô check set time_out
    handle_change_timeout_checkbox = (e) => {
        const { todo, input } = this.state;
        const todo_t = { ...todo };
        const input_t = { ...input };
        const { checked } = e.target;
        input_t.is_check_time_out = checked;
        if (!checked) {
            todo_t.time_out = null;
            todo_t.repeat = {
                type: '',
                option: [],
                option_time: {
                    times: '',
                    unit: [],
                },
            };
            // this.handle_show_repeat_option();
        } else {
            todo_t.time_out = this.currentDate;
        }
        this.setState({ input: input_t, todo: todo_t });
    };

    // Cập nhạt ô check set remind
    handle_change_remind_checkbox = (e) => {
        const { todo, input } = this.state;
        const todo_t = { ...todo };
        const input_t = { ...input };
        input_t.is_check_remind = e.target.checked;
        this.setState({ input: input_t });
        if (!e.target.checked) {
            todo_t.remind = null;
        } else {
            todo_t.remind = this.currentDate;
        }
        this.setState({ todo: todo_t });
    };

    // Xử lý cập nhật 1 todo
    update_todo = (todo_t = null, handle_modal = true, is_show_toast = true) => {
        const { loading, todo } = this.state;
        const { todos, dispatch } = this.props;
        if (todo.is_complete) {
            toast.dismiss();
            toast.error('Không thể chỉnh sửa công việc đã hoàn thành');
            return;
        }
        if (!todo.title) {
            toast.dismiss();
            toast.error('Bạn cần thêm tên công việc trước khi thực hiện cập nhật');
            return;
        }
        const { handle_show_modal_option } = this.props;
        const todo_params = todo_t;
        if (todo_params.time_out && typeof todo_params.time_out === 'string') {
            todo_params.time_out = new Date(todo_params.time_out.substr(0, 16)).getTime();
        }
        if (todo_params.remind && typeof todo_params.remind === 'string') {
            todo_params.remind = new Date(todo_params.remind.substr(0, 16)).getTime();
        }
        if (loading) return;
        if (is_show_toast) this.set_loading(true);

        if (is_show_toast) {
            toast.dismiss();
            toast.success('Đã lưu thay đổi');
        }
        dispatch({
            type: CHANGE_LIST_TODO,
            payload: {
                todos: todos.map((t) => {
                    if (t._id === todo._id) {
                        return { ...t, ...todo_params };
                    }
                    return t;
                }),
            },
        });

        this.setState({ todo: { ...todo, ...todo_params } });
        if (handle_modal) handle_show_modal_option();
        api_update_todo(todo._id, todo_params).then((res) => {
            if (!handle_modal) {
                this.set_loading(false);
            }
            if (!res) {
                toast.dismiss();
                toast.error('Đã xảy ra lỗi, vui lòng thử lại');
            }
        });
    };

    // Thêm file đính kèm
    async on_change_file(e) {
        // const { files } = e.target;
        // const { todo } = this.state;
        // const todo_t = { ...todo };
        // if (!isEmpty(files)) {
        //     eachOfSeries(files, (file, i, callback) => {
        //         this.setState({
        //             files_pending: {
        //                 name: file.name,
        //                 type: 'pending',
        //                 index: i,
        //                 total: files.length,
        //             },
        //         });
        //         UploadChunk([file], null, (res) => {
        //             if (res.status === 200) {
        //                 const { url } = res.data;
        //                 todo_t.files.unshift({
        //                     name: url[0].file_name,
        //                     url: url[0].url,
        //                     size: url[0].file_size,
        //                     thumb90: url[0].thumb90 || null,
        //                     type: url[0].type,
        //                 });
        //                 toast.dismiss();
        //                 if (files.length - i === 1) {
        //                     e.target.value = null;
        //                     toast.success('Tải lên tệp hoàn tất.');
        //                 }
        //                 this.setState({ files_pending: null });
        //                 this.update_todo(todo_t, false, false);
        //                 callback();
        //             }
        //         });
        //     });
        // }
    }

    // Xóa file đính kèm
    handle_delete_file = (index) => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        todo_t.files.splice(index, 1);
        // this.update_todo(todo_t, false);
        this.update_todo({ files: todo_t.files });
    };

    // Xóa todo
    handle_delete_todo = (id) => {
        api_delete_todo(id).then((res) => {
            toast.dismiss();
            if (res) {
                const { handle_show_modal_option } = this.props;
                handle_show_modal_option();
                toast.success('Xóa tác vụ thành công!', {});
            } else {
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        });
    };

    // Cập nhật thời gian nhắc nhở
    handle_change_remind = (e) => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        todo_t.remind = e.target.value;
        this.setState({ todo: todo_t });
    };

    // Thêm note
    handle_change_note = (e) => {
        const { note_t } = this.state;
        let note = note_t;
        let { value } = e.target;
        value = value.trimStart();
        if (e.keyCode === 13 && value) {
            const { todo } = this.state;
            const todo_t = { ...todo };
            todo_t.note.push({
                content: value.trim(),
                created_at: PaserDatetime_H_M_D_M_Y(),
            });
            note = '';
            // this.update_todo(todo_t, false);
            this.update_todo({ note: todo_t.note }, false);
        } else {
            note = value;
        }
        this.setState({ note_t: note });
    };

    // Xóa note
    handle_delete_note = (index) => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        if (todo.note.length > 0) {
            todo_t.note.splice(index, 1);
            // this.setState({ todo: todo_t });
            this.update_todo({ note: todo_t.note }, false);
        }
    };

    // Thay đổi kiểu của repeat
    handle_change_repeat = (type_t) => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        if (type_t === 'weekly') {
            todo_t.repeat.option = [1];
            todo_t.repeat.option_time = { times: 1, unit: 'week' };
        } else if (type_t !== 'option' || type_t !== todo_t.repeat.type) {
            todo_t.repeat.option = [];
            if (type_t !== 'option') {
                todo_t.repeat.option_time = [];
            }
        }
        if (type_t === 'option') {
            if (todo_t.repeat.option_time.length < 1) {
                // Nếu chưa set option_time
                todo_t.repeat = {
                    type: 'option',
                    option: [],
                    option_time: {
                        times: 1,
                        unit: 'week',
                    },
                };
            }
        }
        todo_t.repeat.type = type_t;
        // Nếu chưa có time_out thì set time_out
        if (!todo_t.time_out) {
            todo_t.time_out = this.currentDate;
        }
        this.setState({ todo: todo_t });
    };

    // Xử lý onchange của repeat
    handle_change_repeat_check_box = (e) => {
        const { checked } = e.target;
        const { todo } = this.state;
        const todo_t = { ...todo };
        if (!checked) {
            todo_t.repeat = {
                type: '',
                option: [],
                option_time: {
                    times: '',
                    unit: [],
                },
            };
        } else {
            todo_t.repeat.type = 'daily';
            // Nếu chưa có time_out thì set time_out
            if (!todo_t.time_out) {
                todo_t.time_out = this.currentDate;
            }
        }
        this.setState({ todo: todo_t });
    };

    // Thay đổi option của repeat
    handle_change_repeat_days = (option_t = []) => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        if (todo_t.repeat.type === 'weekly' || todo_t.repeat.type === 'option') {
            // nếu tồn tại rồi thì xóa
            const index = todo_t.repeat.option.indexOf(option_t);
            if (index !== -1) {
                todo_t.repeat.option.splice(index, 1);
            } else {
                todo_t.repeat.option.push(option_t);
            }
            this.setState({ todo: todo_t });
        }
    };

    // Thay đổi repeat phần lặp lại là option
    handle_change_repeat_option = (e_times = null, e_unit = null) => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        todo_t.repeat.type = 'option';
        todo_t.repeat.option_time = {
            times: e_times !== null ? e_times.target.value : todo_t.repeat.option_time.times,
            unit: e_unit !== null ? e_unit.target.value : todo_t.repeat.option_time.unit,
        };
        this.setState({ todo: todo_t });
    };

    handle_change_is_important = () => {
        const { todo } = this.state;
        this.update_todo({ is_important: todo.is_important ? 0 : 1 }, false);
    };

    handle_show_img_viewer = (photo, is_show) => {
        this.setState({
            is_show_img_viewer: is_show,
            photo_attach_view: photo,
        });
    };

    handleDownload = (url, filename) => {
        Download(url, filename);
    };

    // render ds file đính kèm
    files_preview = () => {
        const arrFileExt = [
            '3ds',
            'aac',
            'ai',
            'avi',
            'bmp',
            'cad',
            'cdr',
            'css',
            'dat',
            'dll',
            'dmg',
            'doc',
            'eps',
            'fla',
            'flv',
            'gif',
            'html',
            'indd',
            'iso',
            'jpg',
            'js',
            'midi',
            'mov',
            'mp3',
            'mpg',
            'pdf',
            'php',
            'png',
            'ppt',
            'ps',
            'psd',
            'raw',
            'sql',
            'svg',
            'tif',
            'txt',
            'wmv',
            'xls',
            'xml',
            'zip',
        ];
        const { todo } = this.state;
        if (todo.files) {
            if (todo.files.length > 0) {
                return todo.files.map((file, index) => {
                    const re = /(?:\.([^.]+))?$/;
                    const ext = re.exec(file.name)[1];
                    let dclass = `icon-${ext}`;
                    if (!arrFileExt.includes(ext)) {
                        dclass = 'icon-none';
                    }
                    let img_size = file.size;
                    let suffix = 'KB';
                    if (img_size >= 1024 && img_size < 1024000) {
                        suffix = 'KB';
                        img_size = Math.round((img_size / 1024) * 100) / 100;
                    } else if (img_size >= 1024000) {
                        suffix = 'MB';
                        img_size = Math.round((img_size / 1024000) * 100) / 100;
                    }
                    // const photos = [{ src: file.url, fullscreen: true }];
                    const photos = [
                        {
                            caption: file.name,
                            source: {
                                download: file.url,
                                fullscreen: file.url,
                                regular: file.url,
                                thumbnail: file.url,
                            },
                        },
                    ];
                    return (
                        <div key={Math.random().toString(36)} className="_work_modal_file">
                            {file.type.indexOf('image') !== -1 ? (
                                <img
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => this.handle_show_img_viewer(photos, true)}
                                    className="_work_modal_file_img"
                                    src={file.thumb90 ? file.thumb90 : null}
                                    alt="file"
                                />
                            ) : (
                                <div className="_chat_item_file_img">
                                    <i className={dclass} /> {!arrFileExt.includes(ext) && <span>{ext} </span>}
                                </div>
                            )}
                            <div className="_work_modal_file_content">
                                <div className="_work_modal_file_title">
                                    <h2>{file.name}</h2>
                                    <p>{`${img_size} ${suffix}`}</p>
                                </div>
                                {file.type.indexOf('image') === -1 && (
                                    <div className="_work_modal_download" onClick={() => this.handleDownload(file.url, file.title)}>
                                        {' '}
                                        <i className="icon-download" />{' '}
                                    </div>
                                )}
                                <span className="_work_modal_file_close" onClick={() => this.handle_delete_file(index)}>
                                    <i className="blo close-icon" />
                                </span>
                            </div>
                        </div>
                    );
                });
            }
        }
        return null;
    };

    // render ra danh sách note
    note_render = () => {
        const { todo } = this.state;
        if (todo) {
            if (todo.note.length > 0) {
                return todo.note.map((note, index) => (
                    <div className="_work_modal_items_note" key={Math.random().toString(36)}>
                        <h2>{note.content}</h2>
                        <div className="_work_modal_items_time">{note.created_at}</div>
                        <span className="_work_modal_file_close close_note" onClick={() => this.handle_delete_note(index)}>
                            <i className="blo close-icon" />
                        </span>
                    </div>
                ));
            }
        }
        return null;
    };

    render() {
        const { handle_show_modal_option } = this.props;
        const { todo, is_show_img_viewer, files_pending, input, note_t, photo_attach_view, is_show_modal_confirm } = this.state;
        return (
            <>
                {/* <Spin spin={loading}> */}
                {is_show_img_viewer ? (
                    <ModalGateway>
                        <Modal onClose={() => this.handle_show_img_viewer(null, false)}>
                            <Carousel views={photo_attach_view} isFullscreen />
                        </Modal>
                    </ModalGateway>
                ) : null}
                <div className="work_modal">
                    <span className="_work_modal_close" onClick={handle_show_modal_option}>
                        <i className="blo close-icon" />
                    </span>
                    <div className="work_modal_header">
                        <h2>
                            <i className={todo.is_important ? 'fas fa-star active' : 'fal fa-star'} onClick={this.handle_change_is_important} />
                            <EditableText
                                disabled={todo.is_complete}
                                input_class="input-title"
                                onChange={this.on_change_title_todo}
                                handleEnter={() => {
                                    if (!todo.title) {
                                        toast.dismiss();
                                        toast.error('Tên công việc không thể bỏ trống');
                                        return;
                                    }
                                    this.update_todo({ title: todo.title }, false);
                                }}
                                value={todo.title}
                            />
                        </h2>
                    </div>
                    <div className="work_modal_content">
                        {/* HET HAN TODO */}
                        <div className="_work_modal_items _work_modal_xdate">
                            <div className="_work_modal_items_labelx">
                                <input
                                    disabled={todo.is_complete}
                                    type="checkbox"
                                    checked={todo.time_out ? todo.time_out : input.is_check_time_out}
                                    onChange={this.handle_change_timeout_checkbox}
                                    id="timeout_id"
                                />
                                <label htmlFor="timeout_id">Ngày đến hạn</label>
                                <div className="_work_modal_items_contentx">
                                    <input
                                        disabled={todo.is_complete}
                                        type="datetime-local"
                                        value={todo.time_out ? PaserDatetimeLocalInput(new Date(todo.time_out)) : this.currentDate}
                                        onChange={this.handle_change_timeout}
                                    />
                                    {/* <div className="_work_items_contentx_toolbox">
                                            <button type="button" className="btn-save">Lưu</button>
                                            <button type="button" className="btn-exit">Hủy</button>
                                        </div> */}
                                </div>
                            </div>
                        </div>
                        {/* BAT THONG BAO */}
                        <div className="_work_modal_items _work_modal_xdate">
                            {/* <label> */}
                            <div className="_work_modal_items_labelx">
                                <input
                                    id="remind_id"
                                    disabled={todo.is_complete}
                                    type="checkbox"
                                    checked={todo.remind ? true : input.is_check_remind}
                                    onChange={this.handle_change_remind_checkbox}
                                />
                                <label htmlFor="remind_id">Nhắc nhở tôi</label>
                                <div className="_work_modal_items_contentx">
                                    <input
                                        disabled={todo.is_complete}
                                        type="datetime-local"
                                        value={todo.remind ? PaserDatetimeLocalInput(new Date(todo.remind)) : this.currentDate}
                                        onChange={this.handle_change_remind}
                                    />
                                </div>
                            </div>
                            {/* </label> */}
                        </div>
                        {/* LAP LAI */}
                        <div className="_work_modal_items _work_modal_xdate">
                            <div className="_work_modal_items_labelx">
                                <input
                                    disabled={todo.is_complete}
                                    type="checkbox"
                                    checked={todo.repeat.type}
                                    onChange={this.handle_change_repeat_check_box}
                                    id="repeat"
                                />
                                <label htmlFor="repeat">Lặp lại</label>
                                <div className="_work_modal_items_contentx">
                                    <Tab.Container id="left-tabs-example" activeKey={todo.repeat.type ? todo.repeat.type : ''}>
                                        <Nav justify variant="tabs">
                                            <Nav.Item onClick={() => this.handle_change_repeat('daily')}>
                                                <Nav.Link eventKey="daily">Hàng ngày</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item onClick={() => this.handle_change_repeat('weekly')}>
                                                <Nav.Link eventKey="weekly">Hàng tuần</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item onClick={() => this.handle_change_repeat('monthly')}>
                                                <Nav.Link eventKey="monthly">Hàng tháng</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item onClick={() => this.handle_change_repeat('annual')}>
                                                <Nav.Link eventKey="annual">Hàng năm</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item onClick={() => this.handle_change_repeat('option')}>
                                                <Nav.Link eventKey="option">Tùy chỉnh</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="option">
                                                <div className="_work_modal_loop">
                                                    <div className="row align-items-center work_option_time">
                                                        <div className="col-4">
                                                            <div className="_work_modal_loop_title">Lặp lại mỗi...</div>
                                                        </div>
                                                        <div className="col-4">
                                                            <input
                                                                disabled={todo.is_complete}
                                                                value={isEmpty(todo.repeat.option_time.times) ? 1 : todo.repeat.option_time.times}
                                                                onChange={(e) => this.handle_change_repeat_option(e, null)}
                                                                type="number"
                                                                min="1"
                                                                max="1000"
                                                            />
                                                        </div>
                                                        <div className="col-4">
                                                            <select value={todo.repeat.option_time.unit} onChange={(e) => this.handle_change_repeat_option(null, e)}>
                                                                <option value="week">Tuần</option>
                                                                <option value="month">Tháng</option>
                                                                <option value="year">Năm</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                    {todo.repeat.type === 'weekly' || todo.repeat.option_time.unit === 'week' ? (
                                        <div className="_work_modal_loop_last">
                                            <h2>Thứ...</h2>
                                            <div className="_work_modal_loop_last_ct">
                                                <Nav justify variant="tabs">
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            className={todo.repeat.option.indexOf(1) !== -1 ? 'active' : ''}
                                                            onClick={() => this.handle_change_repeat_days(1)}
                                                        >
                                                            T2
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            className={todo.repeat.option.indexOf(2) !== -1 ? 'active' : ''}
                                                            onClick={() => this.handle_change_repeat_days(2)}
                                                        >
                                                            T3
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            className={todo.repeat.option.indexOf(3) !== -1 ? 'active' : ''}
                                                            onClick={() => this.handle_change_repeat_days(3)}
                                                        >
                                                            T4
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            className={todo.repeat.option.indexOf(4) !== -1 ? 'active' : ''}
                                                            onClick={() => this.handle_change_repeat_days(4)}
                                                        >
                                                            T5
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            className={todo.repeat.option.indexOf(5) !== -1 ? 'active' : ''}
                                                            onClick={() => this.handle_change_repeat_days(5)}
                                                        >
                                                            T6
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            className={todo.repeat.option.indexOf(6) !== -1 ? 'active' : ''}
                                                            onClick={() => this.handle_change_repeat_days(6)}
                                                        >
                                                            T7
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            className={todo.repeat.option.indexOf(0) !== -1 ? 'active' : ''}
                                                            onClick={() => this.handle_change_repeat_days(0)}
                                                        >
                                                            CN
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                {/* ) : null} */}
                            </div>
                        </div>
                        {/* THEM FILE */}
                        <div className="_work_modal_items">
                            <label>
                                <div
                                    className="_work_modal_items_content"
                                    onClick={() => {
                                        toast.dismiss();
                                        toast.error('Tính năng đang bảo trì.');
                                    }}
                                >
                                    <div className="_work_modal_items_title">Thêm tệp</div>
                                    <span>Chọn file</span>
                                    {/* <input
                                        disabled={todo.is_complete || !isEmpty(files_pending)}
                                        type="file"
                                        onChange={() => { toast.dismiss(); toast.success('Chức năng đang được hoàn thiện.'); }}
                                        multiple
                                        max="4"
                                        maxLength="4"
                                        accept=".jpg,.png,.jpeg,.gif,.tiff,.json,.bmp,.doc,.txt,.png,.avi,.docx,.html,.htm,.mp3,.pdf,.ppsx,.ppsm,.pps,.ppam,.potx,.psd"
                                    /> */}
                                </div>
                            </label>
                            {/* <Spin> */}
                            <div className="_work_modal_items_contentx _work_modal_const active">
                                {!isEmpty(files_pending) ? (
                                    <>
                                        <div className="_work_modal_file">
                                            <div className="_work_modal_file_img" />
                                            <div className="_work_modal_file_content">
                                                <div className="_work_modal_file_title">
                                                    <h2>{files_pending.name}</h2>
                                                    <p>{`Đang tải lên... (còn lại ${files_pending.total - 1 - files_pending.index} tệp)`}</p>
                                                </div>
                                                <span className="_work_modal_file_close">{/* <i className="blo close-icon" /> */}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                                {this.files_preview()}
                            </div>
                            {/* </Spin> */}
                        </div>
                        {/* THEM NOTE */}
                        <div className="_work_modal_items" style={{ paddingTop: '20px' }}>
                            <h2>Ghi chú</h2>
                            <textarea
                                placeholder=""
                                disabled={todo.is_complete}
                                value={note_t}
                                onChange={this.handle_change_note}
                                onKeyDown={this.handle_change_note}
                            />
                            <div className="_work_modal_items_contentx _work_modal_const active">{this.note_render()}</div>
                        </div>
                        <div className="_work_modal_footer">
                            {/* <span className="delete_button" onClick={this.handle_show_modal_confirm}>
                                <i className="icon-trash" /> Xóa công việc
                            </span> */}
                            <div className="btn_save_close">
                                <button type="button" className="delete_button" onClick={this.handle_show_modal_confirm}>
                                    Xóa công việc
                                </button>
                            </div>
                            <div className="btn_save_close">
                                <button type="button" className="close_button" onClick={handle_show_modal_option}>
                                    Đóng
                                </button>
                                <button type="button" className="save_button" onClick={() => this.update_todo()}>
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL XÁC NHẬN XÓA TODO */}
                {/* <Confirm show={is_show_modal_confirm} mess="Bạn có chắc chắn muốn xóa ?" onClose={this.handle_show_modal_confirm} onOk={this.handle_delete_todo} /> */}

                <ModalBootStrap size="sm" show={is_show_modal_confirm} onHide={this.handle_show_modal_confirm} backdrop="static">
                    <ModalBootStrap.Body>Bạn có chắc chắn muốn xóa</ModalBootStrap.Body>
                    <ModalBootStrap.Footer style={{ padding: '0.4rem' }}>
                        <Button variant="secondary margin-right-8" size="sm" onClick={this.handle_show_modal_confirm}>
                            Hủy
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => this.handle_delete_todo(todo._id)}>
                            Xác nhận
                        </Button>
                    </ModalBootStrap.Footer>
                </ModalBootStrap>
                {/* </Spin> */}
            </>
        );
    }
}

const mapStateToProps = ({ state }) => ({
    todos: state.todos,
});

export default withRouter(connect(mapStateToProps)(ModalShowTodo));
