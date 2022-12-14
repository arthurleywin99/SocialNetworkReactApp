import React from 'react';
import { Button, List, Modal, Radio, Segment } from 'semantic-ui-react';
import { ReportExampleList } from '../../utils/utils';

function ReportModal({ showReportModal, setShowReportModal, handleSendReport, setDescribe }) {
  return (
    <>
      <Modal size='small' open={showReportModal} onClose={() => setShowReportModal(false)} onOpen={() => setShowReportModal(true)}>
        <Modal.Header>Báo cáo</Modal.Header>
        <Modal.Content>
          <h3>Hãy chọn vấn đề</h3>
          <p>Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với Facebook.</p>
        </Modal.Content>
        <Modal.Content>
          <List>
            {ReportExampleList.map((item, i) => (
              <List.Item key={i}>
                <Segment>
                  <Radio toggle name='report' value={item.key} label={item.value} onClick={setDescribe(item.value)} />
                </Segment>
              </List.Item>
            ))}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={handleSendReport}>
            Xác nhận
          </Button>
          <Button negative onClick={() => setShowReportModal(false)}>
            Thoát
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ReportModal;
