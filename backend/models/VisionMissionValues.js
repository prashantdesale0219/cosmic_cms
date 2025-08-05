import mongoose from 'mongoose';

const visionMissionValuesSchema = new mongoose.Schema({
  vision: {
    title: {
      type: String,
      default: 'Vision'
    },
    description: {
      type: String,
      required: true,
      default: 'Cosmic Powertech envisions a world where sustainable living is second nature, driven by the widespread adoption of clean, abundant renewable energy. We dedicate ourselves to crafting tailored solar solutions that precisely address the distinctive requirements of every household, business, and industry we serve, while simultaneously advancing a healthier planet.'
    },
    additionalDescription: {
      type: String,
      default: 'Our pledge reaches far beyond routine operations; it infuses each consultation, installation, and maintenance visit with purpose, ensuring measurable, long-term impact. Guided by an unwavering belief in a future powered exclusively by renewable resources, we continually innovate, educate, and collaborate to accelerate India\'s transition toward carbon-free prosperity and global clean-energy leadership.'
    }
  },
  mission: {
    title: {
      type: String,
      default: 'Mission'
    },
    description: {
      type: String,
      required: true,
      default: 'The dedication to achieve our vision is a reflected in our mission to make solar power accessible and affordable, thereby enabling individuals and businesses to participate actively in the global shift towards sustainability.'
    },
    additionalDescription: {
      type: String,
      default: 'By integrating advanced technology with personalized service, we aim to empower communities to harness solar energy effectively, reducing reliance on fossil fuels and promoting environmental stewardship. Our efforts are aligned with broader initiatives to mitigate climate change and support India\'s green energy goals, including the ambitious target of achieving 500 GW of renewable energy capacity by 2030.'
    },
    finalDescription: {
      type: String,
      default: 'Through our unwavering focus on quality, innovation, and customer satisfaction, Cosmic Powertech aspires to be a leading force in the renewable energy, driving positive change and contributing to a sustainable future for all.'
    }
  },
  values: {
    title: {
      type: String,
      default: 'Value'
    },
    description: {
      type: String,
      required: true,
      default: 'At Cosmic Powertech, our values are rooted in sustainability, innovation, and people-first service. We are committed to making solar energy accessible and affordable, empowering individuals and businesses to join India\'s green revolution. By integrating advanced technology with customized solutions, we help reduce dependence on fossil fuels and contribute to the nation\'s goal of 500 GW renewable energy by 2030.'
    },
    additionalDescription: {
      type: String,
      default: 'Every project reflects our dedication to climate action, engineering excellence, and long-term reliability. With a team driven by integrity and purpose, we deliver clean energy solutions that not only power homes and industries but also inspire a sustainable, greener future.'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('VisionMissionValues', visionMissionValuesSchema);