import express from 'express';
import { AISpeaker } from '../speaker/ai';

export function createSpeakerAPI(speaker: AISpeaker) {
  const router = express.Router();

  // 切换音色的接口
  router.post('/switch-speaker', async (req, res) => {
    try {
      const { speaker: speakerName } = req.body;
      
      if (!speakerName) {
        return res.status(400).json({ 
          success: false, 
          message: '请提供音色名称' 
        });
      }

      const success = await speaker.switchSpeaker(speakerName);
      
      if (success) {
        await speaker.response({
          text: `音色已切换为${speakerName}`,
          keepAlive: speaker.keepAlive
        });
      }

      return res.json({ 
        success, 
        message: success ? `音色已切换为${speakerName}` : '音色切换失败'
      });

    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: '服务器内部错误',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // 获取可用音色列表的接口
router.get('/list', async (req, res) => {
  try {
    const namesOnly = req.query.namesOnly !== 'false';  // 获取查询参数
    const ttsBaseUrl = process.env.TTS_BASE_URL;
    
    if (!ttsBaseUrl) {
      return res.status(400).json({
        success: false,
        message: '未配置 TTS 服务'
      });
    }

    const response = await fetch(`${ttsBaseUrl}/speakers`);
    const speakers = await response.json();

    // 根据 namesOnly 参数处理返回数据
    const data = namesOnly 
      ? speakers.map((speaker: any) => speaker.name)  // 只返回名称列表
      : speakers;  // 返回完整信息

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '获取音色列表失败',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

  return router;
}